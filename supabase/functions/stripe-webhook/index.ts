import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return new Response('Missing signature', { status: 400 })
    }

    // Get webhook secret from environment
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('Missing webhook secret')
      return new Response('Webhook secret not configured', { status: 500 })
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('Missing Stripe secret key')
      return new Response('Stripe not configured', { status: 500 })
    }

    const stripe = new (await import('https://esm.sh/stripe@13.11.0')).default(
      stripeSecretKey,
      { apiVersion: '2023-10-16' }
    )

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response('Invalid signature', { status: 400 })
    }

    console.log('Webhook event received:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      console.log('Payment completed for session:', session.id)

      // Validate session data
      if (!session.id || !session.metadata?.order_id) {
        console.error('Invalid session data')
        return new Response('Invalid session data', { status: 400 })
      }

      // Get the order to check inmate_id and record_types
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .select('id, inmate_id, record_types')
        .eq('stripe_session_id', session.id)
        .eq('id', session.metadata.order_id)
        .single()

      if (orderError || !order) {
        console.error('Failed to fetch order:', orderError)
        return new Response('Order not found', { status: 404 })
      }

      console.log('Processing order:', order.id, 'for inmate:', order.inmate_id)

      // Check if inmate exists in inmates table (inmate_id is doc_number)
      const { data: inmate, error: inmateError } = await supabaseClient
        .from('inmates')
        .select('id, doc_number, phone_records_available, visitor_records_available, phone_records_available_date, visitor_records_available_date')
        .eq('doc_number', order.inmate_id)
        .single()

      let fulfillmentStatus = 'processing' // Default: inmate not in DB
      let phoneRecordId = null
      let visitorRecordId = null
      let recordsUnlocked = false
      const inmateDocNumber = order.inmate_id

      if (!inmateError && inmate) {
        console.log('Inmate found:', inmate.doc_number)

        // Check if requested records are available
        const requestedPhone = order.record_types.includes('telephone')
        const requestedVisitor = order.record_types.includes('visitor')

        let phoneAvailable = false
        let visitorAvailable = false
        let anyPending = false

        // Check phone records
        if (requestedPhone) {
          if (inmate.phone_records_available) {
            // Fetch phone record ID
            const { data: phoneRecord } = await supabaseClient
              .from('phone_records')
              .select('id')
              .eq('inmate_id', inmate.id)
              .single()

            if (phoneRecord) {
              phoneRecordId = phoneRecord.id
              phoneAvailable = true
              console.log('Phone records available:', phoneRecord.id)
            }
          } else if (inmate.phone_records_available_date) {
            anyPending = true
            console.log('Phone records pending until:', inmate.phone_records_available_date)
          }
        }

        // Check visitor records
        if (requestedVisitor) {
          if (inmate.visitor_records_available) {
            // Fetch visitor record ID
            const { data: visitorRecord } = await supabaseClient
              .from('visitation_records')
              .select('id')
              .eq('inmate_id', inmate.id)
              .single()

            if (visitorRecord) {
              visitorRecordId = visitorRecord.id
              visitorAvailable = true
              console.log('Visitor records available:', visitorRecord.id)
            }
          } else if (inmate.visitor_records_available_date) {
            anyPending = true
            console.log('Visitor records pending until:', inmate.visitor_records_available_date)
          }
        }

        // Determine fulfillment status
        const allRequestedAvailable =
          (!requestedPhone || phoneAvailable) &&
          (!requestedVisitor || visitorAvailable)

        const anyRequestedAvailable = phoneAvailable || visitorAvailable

        if (allRequestedAvailable && anyRequestedAvailable) {
          // All requested records are available
          fulfillmentStatus = 'fulfilled'
          recordsUnlocked = true
          console.log('All requested records fulfilled')
        } else if (anyRequestedAvailable) {
          // Partial availability: unlock what's available
          fulfillmentStatus = 'pending'
          recordsUnlocked = true
          console.log('Partial availability: some records available, others pending')
        } else if (anyPending) {
          // Nothing available yet but some have future dates
          fulfillmentStatus = 'pending'
          recordsUnlocked = false
          console.log('Records pending availability')
        } else {
          // Nothing available, need manual processing
          fulfillmentStatus = 'processing'
          recordsUnlocked = false
          console.log('Records need manual processing')
        }
      } else {
        console.log('Inmate not found in database, status: processing')
      }

      // Determine process_status based on fulfillment
      const processStatus = fulfillmentStatus === 'fulfilled' ? 'completed' : 'processing'

      // Update order with fulfillment details
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({
          payment_status: 'paid',
          process_status: processStatus,
          fulfillment_status: fulfillmentStatus,
          inmate_doc_number: inmateDocNumber,
          phone_record_id: phoneRecordId,
          visitor_record_id: visitorRecordId,
          records_unlocked: recordsUnlocked,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id)
        .eq('id', session.metadata.order_id)

      if (updateError) {
        console.error('Failed to update order status:', updateError)
        return new Response('Failed to update order', { status: 500 })
      }

      console.log('Order updated successfully:', {
        order_id: session.metadata.order_id,
        process_status: processStatus,
        fulfillment_status: fulfillmentStatus,
        records_unlocked: recordsUnlocked,
        phone_record_id: phoneRecordId,
        visitor_record_id: visitorRecordId
      })
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 400 })
  }
})
