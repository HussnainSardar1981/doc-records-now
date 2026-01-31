
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { selectedRecords, inmateId } = await req.json()
    console.log('Payment request received:', { selectedRecords, inmateId })

    // Validate input data
    if (!Array.isArray(selectedRecords) || selectedRecords.length === 0) {
      throw new Error('Invalid or empty record selection')
    }

    if (!inmateId || typeof inmateId !== 'string' || inmateId.trim().length === 0) {
      throw new Error('Valid inmate ID is required')
    }

    // Sanitize inmate ID - allow only alphanumeric characters and basic punctuation
    const sanitizedInmateId = inmateId.trim().replace(/[^a-zA-Z0-9\-_]/g, '');
    if (sanitizedInmateId.length < 3 || sanitizedInmateId.length > 20) {
      throw new Error('Inmate ID must be between 3-20 characters')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      console.error('User authentication failed:', userError)
      throw new Error('Authentication failed')
    }

    console.log('User authenticated:', user.email)

    // Correct record prices mapping - only telephone and visitor records at $29.99 each
    const RECORD_PRICES: { [key: string]: number } = {
      'telephone': 29.99,
      'visitor': 29.99
    }

    // Validate selected records
    const validRecords = selectedRecords.filter(recordId => 
      typeof recordId === 'string' && RECORD_PRICES.hasOwnProperty(recordId)
    );

    if (validRecords.length === 0) {
      console.error('No valid records found. Selected records:', selectedRecords)
      console.error('Valid record types:', Object.keys(RECORD_PRICES))
      throw new Error('No valid records selected')
    }

    // Calculate total amount
    const totalAmount = validRecords.reduce((sum: number, recordId: string) => {
      return sum + RECORD_PRICES[recordId]
    }, 0)

    console.log('Calculated total amount:', totalAmount)

    if (totalAmount <= 0 || totalAmount > 1000) {
      throw new Error('Invalid order total')
    }

    // Create order record in database first
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        user_email: user.email,
        inmate_id: sanitizedInmateId,
        record_types: validRecords,
        paid_amount: totalAmount,
        currency: 'USD',
        payment_status: 'pending',
        process_status: 'received'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      throw new Error('Failed to create order record')
    }

    console.log('Order created successfully:', orderData.id)

    // Initialize Stripe - use STRIPE_SECRET_KEY as the environment variable name
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('Stripe secret key not found')
      throw new Error('Stripe configuration error - secret key not found')
    }

    console.log('Stripe key found, initializing Stripe...')

    const stripe = new (await import('https://esm.sh/stripe@13.11.0')).default(
      stripeSecretKey,
      { apiVersion: '2023-10-16' }
    )

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validRecords.map((recordId: string) => {
        const recordNames: { [key: string]: string } = {
          'telephone': 'Telephone Records',
          'visitor': 'Visitor Records'
        }
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: recordNames[recordId] || 'Prison Record',
              description: `Inmate ID: ${sanitizedInmateId}`,
            },
            unit_amount: Math.round(RECORD_PRICES[recordId] * 100),
          },
          quantity: 1,
        }
      }),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success`,
      cancel_url: `${req.headers.get('origin')}/`,
      metadata: {
        order_id: orderData.id,
        user_id: user.id,
        inmate_id: sanitizedInmateId,
        record_types: validRecords.join(',')
      }
    })

    console.log('Stripe session created:', session.id)

    // Update order with Stripe session ID
    await supabaseClient
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', orderData.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Payment creation failed:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
