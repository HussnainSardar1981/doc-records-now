
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

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

    const gmailUser = Deno.env.get('GMAIL_USER')
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD')

    if (!gmailUser || !gmailPassword) {
      console.error('Gmail credentials not configured')
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

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPassword,
        },
      },
    })

    await client.send({
      from: gmailUser,
      to: gmailUser,
      subject: `Customer Feedback${customerEmail ? ` from ${customerEmail}` : ''}`,
      content: feedback,
      html: emailHtml,
      replyTo: customerEmail || undefined,
    })

    await client.close()

    console.log('Feedback email sent successfully via Gmail')

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
