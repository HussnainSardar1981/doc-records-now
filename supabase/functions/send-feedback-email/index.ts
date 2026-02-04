
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerEmail, feedback } = await req.json()

    if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
      throw new Error('Feedback message is required')
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      throw new Error('Email service not configured')
    }

    const emailHtml = `
      <h2>New Customer Feedback</h2>
      <p><strong>Customer Email:</strong> ${customerEmail || 'Not provided'}</p>
      <hr />
      <p><strong>Feedback:</strong></p>
      <p>${feedback.replace(/\n/g, '<br />')}</p>
      <hr />
      <p><em>Sent from Inmate Insights feedback form</em></p>
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Inmate Insights <onboarding@resend.dev>',
        to: ['Inmateinsights5@gmail.com'],
        subject: `Customer Feedback${customerEmail ? ` from ${customerEmail}` : ''}`,
        html: emailHtml,
        reply_to: customerEmail || undefined,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      throw new Error('Failed to send email')
    }

    const resendData = await resendResponse.json()
    console.log('Feedback email sent successfully:', resendData.id)

    return new Response(
      JSON.stringify({ success: true, message: 'Feedback sent successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Send feedback error:', error)
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
