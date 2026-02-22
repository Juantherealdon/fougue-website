"use server"

import { createClient } from "@supabase/supabase-js"
import { buildContactNotificationEmail, buildContactClientEmail } from "@/lib/emails/contact-confirmation"
import { createContactNotification } from "@/lib/notifications"

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
    let recipientEmail = "hello@fougue.ae"
    if (formData.subject.toLowerCase().includes("collaboration")) {
      recipientEmail = "partners@fougue.ae"
    } else if (formData.subject.toLowerCase().includes("press")) {
      recipientEmail = "press@fougue.ae"
    }

    // Send emails via Resend API
    if (process.env.RESEND_API_KEY) {
      const emailData = {
        customerName: formData.name,
        customerEmail: formData.email,
        subject: formData.subject,
        message: formData.message,
        selectedExperiences: formData.selectedExperiences,
      }

      const subjectMap: Record<string, string> = {
        "Book an Experience": "Experience Inquiry",
        "Gift Inquiry": "Gift Inquiry",
        "Collaboration": "Partnership Inquiry",
        "Press": "Press Inquiry",
        "Other": "General Inquiry",
      }
      const emailSubjectLabel = subjectMap[formData.subject] || "New Inquiry"

      try {
        // 1. Send notification to Fougue team
        const notificationHtml = buildContactNotificationEmail(emailData)
        const notifResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Fougue <no-reply@mail.fougue.ae>",
            to: recipientEmail,
            reply_to: formData.email,
            subject: `${emailSubjectLabel} \u2014 ${formData.name}`,
            html: notificationHtml,
          }),
        })

        if (notifResponse.ok) {
          const result = await notifResponse.json()
          console.log("[v0] Team notification email sent:", result.id)
        } else {
          const errorText = await notifResponse.text()
          console.error("[v0] Team email send failed:", errorText)
        }

        // 2. Send confirmation to client
        const clientHtml = buildContactClientEmail(emailData)
        const clientResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Fougue <no-reply@mail.fougue.ae>",
            to: formData.email,
            subject: `Fougue \u2014 We\u2019ve received your message`,
            html: clientHtml,
          }),
        })

        if (clientResponse.ok) {
          const result = await clientResponse.json()
          console.log("[v0] Client confirmation email sent:", result.id)
        } else {
          const errorText = await clientResponse.text()
          console.error("[v0] Client email send failed:", errorText)
        }
      } catch (emailError) {
        console.error("[v0] Error sending emails:", emailError)
      }
    } else {
      console.log("[v0] RESEND_API_KEY not configured - emails not sent")
    }

    // Create admin notification
    await createContactNotification({
      customerName: formData.name,
      customerEmail: formData.email,
      subject: formData.subject,
      message: formData.message,
    })

    return {
      success: true,
      message: "Thank you! We've received your message and will get back to you soon.",
    }
  } catch (error) {
    console.error("[v0] Error in contact action:", error)
    throw new Error("Failed to process your message. Please try again.")
  }
}
