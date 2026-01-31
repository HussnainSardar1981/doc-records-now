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
    // Use service role key to bypass RLS for reading preview data
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    let currentUserId = null

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseClient.auth.getUser(token)
      currentUserId = user?.id
    }

    const { doc_number } = await req.json()

    if (!doc_number) {
      return new Response(
        JSON.stringify({ error: 'doc_number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Checking availability for inmate:', doc_number)

    // Query inmates table for availability info
    const { data: inmate, error: inmateError } = await supabaseClient
      .from('inmates')
      .select('id, doc_number, first_name, last_name, full_name, phone_records_available, visitor_records_available, phone_records_available_date, visitor_records_available_date, is_dummy')
      .eq('doc_number', doc_number)
      .single()

    if (inmateError || !inmate) {
      console.log('Inmate not found in records database:', doc_number)
      return new Response(
        JSON.stringify({
          exists: false,
          doc_number,
          phone_records: {
            available: false,
            available_date: null,
            status: 'processing'
          },
          visitor_records: {
            available: false,
            available_date: null,
            status: 'processing'
          },
          message: 'Inmate not found in records database. Purchase is allowed - records will be processed manually.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Inmate found:', inmate.full_name, '- Phone:', inmate.phone_records_available, 'Visitor:', inmate.visitor_records_available)

    // Check if user already purchased records for this inmate
    let phoneAlreadyPurchased = false
    let visitorAlreadyPurchased = false
    let existingOrderId = null

    if (currentUserId) {
      console.log('Checking if user', currentUserId, 'already purchased records for', doc_number)
      const { data: existingOrder } = await supabaseClient
        .from('orders')
        .select('id, phone_record_id, visitor_record_id, records_unlocked')
        .eq('user_id', currentUserId)
        .eq('inmate_doc_number', doc_number)
        .eq('payment_status', 'paid')
        .maybeSingle()

      if (existingOrder) {
        existingOrderId = existingOrder.id
        // Check which specific record types were purchased
        phoneAlreadyPurchased = !!existingOrder.phone_record_id && existingOrder.records_unlocked
        visitorAlreadyPurchased = !!existingOrder.visitor_record_id && existingOrder.records_unlocked
        console.log('User already purchased - Order ID:', existingOrderId, 'Phone:', phoneAlreadyPurchased, 'Visitor:', visitorAlreadyPurchased)
      }
    }

    // Determine status for each record type
    const phoneStatus = inmate.phone_records_available
      ? 'available'
      : inmate.phone_records_available_date
        ? 'pending'
        : 'processing'

    const visitorStatus = inmate.visitor_records_available
      ? 'available'
      : inmate.visitor_records_available_date
        ? 'pending'
        : 'processing'

    // Fetch preview data if records are available
    let phonePreview = null
    let visitorPreview = null

    if (inmate.phone_records_available) {
      console.log('Fetching phone records preview for inmate_id:', inmate.id)
      const { data: phoneData, error: phoneError } = await supabaseClient
        .from('phone_records')
        .select('call_history, total_calls, total_approved_numbers')
        .eq('inmate_id', inmate.id)
        .single()

      if (phoneError) {
        console.error('Error fetching phone records:', phoneError)
      } else if (phoneData) {
        console.log('Phone data found:', { total_calls: phoneData.total_calls, has_call_history: !!phoneData.call_history })
        if (phoneData.call_history && Array.isArray(phoneData.call_history)) {
          // Get top 5 phone numbers for preview
          const topCalls = phoneData.call_history.slice(0, 5)
          phonePreview = {
            top_numbers: topCalls,
            total_calls: phoneData.total_calls,
            total_unique_numbers: phoneData.total_approved_numbers
          }
          console.log('Phone preview created with', topCalls.length, 'numbers')
        } else {
          console.log('call_history is not an array or is null')
        }
      } else {
        console.log('No phone data returned')
      }
    }

    if (inmate.visitor_records_available) {
      console.log('Fetching visitor records preview for inmate_id:', inmate.id)
      const { data: visitorData, error: visitorError } = await supabaseClient
        .from('visitation_records')
        .select('approved_visitors, visit_history, total_approved_visitors, total_visits')
        .eq('inmate_id', inmate.id)
        .single()

      if (visitorError) {
        console.error('Error fetching visitor records:', visitorError)
      } else if (visitorData) {
        console.log('Visitor data found:', { total_approved_visitors: visitorData.total_approved_visitors, total_visits: visitorData.total_visits })
        // Build preview from approved_visitors and/or visit_history
        const approved = Array.isArray(visitorData.approved_visitors) ? visitorData.approved_visitors : []
        const visits = Array.isArray(visitorData.visit_history) ? visitorData.visit_history : []

        // Collect unique visitors from both sources
        const visitorMap = new Map()
        for (const v of approved) {
          if (v.name) visitorMap.set(v.name, { name: v.name, relationship: v.relationship || v.status })
        }
        for (const v of visits) {
          const vName = v.visitor_name || v.name
          if (vName && !visitorMap.has(vName)) {
            visitorMap.set(vName, { name: vName, relationship: v.relationship })
          }
        }

        const allVisitors = Array.from(visitorMap.values())
        const totalVisitors = visitorData.total_approved_visitors || allVisitors.length

        if (allVisitors.length > 0) {
          visitorPreview = {
            top_visitors: allVisitors.slice(0, 5),
            total_visitors: totalVisitors
          }
          console.log('Visitor preview created with', visitorPreview.top_visitors.length, 'visitors')
        } else {
          console.log('No visitor entries found in approved_visitors or visit_history')
        }
      } else {
        console.log('No visitor data returned')
      }
    }

    return new Response(
      JSON.stringify({
        exists: true,
        doc_number: inmate.doc_number,
        inmate_name: inmate.full_name,
        is_dummy: inmate.is_dummy,
        order_id: existingOrderId,
        phone_records: {
          available: inmate.phone_records_available,
          available_date: inmate.phone_records_available_date,
          status: phoneStatus,
          preview: phonePreview,
          already_purchased: phoneAlreadyPurchased
        },
        visitor_records: {
          available: inmate.visitor_records_available,
          available_date: inmate.visitor_records_available_date,
          status: visitorStatus,
          preview: visitorPreview,
          already_purchased: visitorAlreadyPurchased
        },
        message: 'Record availability checked successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Check availability error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
