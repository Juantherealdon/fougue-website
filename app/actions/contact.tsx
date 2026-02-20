"use server"

import { createClient } from "@supabase/supabase-js"
import resend from "resend" // Declare the resend variable

export async function sendContactEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
  selectedExperiences?: string[]
}) {
  try {
    console.log("[v0] Contact form submission:", formData.message.substring(0, 50))

    // Create an anonymous Supabase client for public inserts
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration")
    }

    const supabasePublic = createClient(supabaseUrl, supabaseKey)

    // Store the contact message in Supabase
    const { data, error } = await supabasePublic
      .from("contact_messages")
      .insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error storing contact message:", error)
    } else {
      console.log("[v0] Contact message stored:", data?.message?.substring(0, 50))
    }

    // Determine recipient email based on subject
    let recipientEmail = "love@fougue.ae"
    if (formData.subject.toLowerCase().includes("collaboration")) {
      recipientEmail = "collaborations@fougue.ae"
    }

    // Send email via Resend API
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Fougué <no-reply@mail.fougue.ae>",
            to: recipientEmail,
            reply_to: formData.email,
            subject: `${formData.subject} - ${formData.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #800913;">New Contact Form Submission</h2>
                <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #800913;">
                  <p style="margin: 5px 0;"><strong>From:</strong> ${formData.name}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
                  <p style="margin: 5px 0;"><strong>Subject:</strong> ${formData.subject}</p>
                </div>
                ${formData.selectedExperiences && formData.selectedExperiences.length > 0 ? `
                <div style="background: #fff8f0; padding: 15px; margin: 20px 0; border-left: 4px solid #800913;">
                  <p style="margin: 0 0 10px 0;"><strong>Interested in Experience(s):</strong></p>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${formData.selectedExperiences.map(exp => `<li style="margin: 5px 0;">${exp}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}
                <div style="background: white; padding: 20px; border: 1px solid #ddd;">
                  <h3 style="margin-top: 0;">Message:</h3>
                  <p style="white-space: pre-wrap;">${formData.message}</p>
                </div>
              </div>
            `,
          }),
        })

        if (emailResponse.ok) {
          const result = await emailResponse.json()
          console.log("[v0] Email sent successfully:", result.id)
        } else {
          const errorText = await emailResponse.text()
          console.error("[v0] Email send failed:", errorText)
        }
      } catch (emailError) {
        console.error("[v0] Error sending email:", emailError)
      }
    } else {
      console.log("[v0] RESEND_API_KEY not configured - email not sent")
    }

    return {
      success: true,
      message: "Thank you! We've received your message and will get back to you soon.",
    }
  } catch (error) {
    console.error("[v0] Error in contact action:", error)
    throw new Error("Failed to process your message. Please try again.")
  }
}
