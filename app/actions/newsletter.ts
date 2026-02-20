"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * ROBUST Server Action to handle both simple and waitlist newsletter subscriptions
 * 
 * Automatically detects subscription type:
 * - Simple (Footer): Only email + source
 * - Waitlist (Popup): Full details with firstName, lastName, phone, interests
 * 
 * @param formData - Object containing subscription data
 * @returns Object with success status and message
 * 
 * Usage examples:
 * 
 * Simple subscription (Footer):
 * ```tsx
 * const result = await subscribeUser({
 *   email: 'user@example.com',
 *   source: 'footer'
 * })
 * ```
 * 
 * Waitlist subscription (Popup):
 * ```tsx
 * const result = await subscribeUser({
 *   email: 'user@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '+971501234567',
 *   interests: ['Romantic Dinners', 'Cultural Journeys'],
 *   source: 'popup'
 * })
 * ```
 */
export async function subscribeUser(formData: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  interests?: string[]
  source?: 'footer' | 'popup' | 'checkout'
}) {
  try {
    // === VALIDATION ===
    const { email, firstName, lastName, phone, interests, source = 'footer' } = formData

    // Validate email
    if (!email || typeof email !== 'string') {
      return { 
        success: false, 
        message: "Email is required" 
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { 
        success: false, 
        message: "Please provide a valid email address" 
      }
    }

    // Detect subscription type
    const isWaitlist = !!(firstName || lastName || phone || (interests && interests.length > 0))
    const subscriptionType = isWaitlist ? 'waitlist' : 'simple'

    // Validate waitlist fields if provided
    if (isWaitlist) {
      if (!firstName || firstName.trim().length < 2) {
        return { 
          success: false, 
          message: "First name must be at least 2 characters" 
        }
      }
      if (!lastName || lastName.trim().length < 2) {
        return { 
          success: false, 
          message: "Last name must be at least 2 characters" 
        }
      }
      if (phone && phone.length < 8) {
        return { 
          success: false, 
          message: "Please provide a valid phone number" 
        }
      }
    }

    const supabase = createClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status, subscription_type")
      .eq("email", email.toLowerCase())
      .single()

    if (existing) {
      // If previously unsubscribed, reactivate with new data
      if (existing.status === 'unsubscribed') {
        const updateData: any = {
          status: 'active',
          updated_at: new Date().toISOString(),
          source
        }

        // Update with new waitlist data if provided
        if (isWaitlist) {
          updateData.subscription_type = 'waitlist'
          updateData.first_name = firstName?.trim()
          updateData.last_name = lastName?.trim()
          updateData.phone = phone
          updateData.interests = interests
        }

        await supabase
          .from("newsletter_subscribers")
          .update(updateData)
          .eq("id", existing.id)
        
        return { 
          success: true, 
          message: "Welcome back! You've been resubscribed.",
          resubscribed: true
        }
      }

      // If upgrading from simple to waitlist, update details
      if (existing.subscription_type === 'simple' && isWaitlist) {
        await supabase
          .from("newsletter_subscribers")
          .update({
            subscription_type: 'waitlist',
            first_name: firstName?.trim(),
            last_name: lastName?.trim(),
            phone: phone,
            interests: interests,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id)

        return { 
          success: true, 
          message: "Your subscription has been updated with your details!",
          updated: true
        }
      }
      
      return { 
        success: true, 
        message: "You're already subscribed!",
        alreadySubscribed: true 
      }
    }

    // === INSERT NEW SUBSCRIBER ===
    const insertData: any = {
      email: email.toLowerCase(),
      source,
      status: 'active',
      subscription_type: subscriptionType
    }

    if (isWaitlist) {
      insertData.first_name = firstName?.trim()
      insertData.last_name = lastName?.trim()
      insertData.phone = phone
      insertData.interests = interests || []
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([insertData])

    if (error) {
      console.error("[v0] Error adding newsletter subscriber:", error)
      return { 
        success: false, 
        message: "Something went wrong. Please try again." 
      }
    }

    return { 
      success: true, 
      message: isWaitlist 
        ? "You're on the waitlist! We'll be in touch soon." 
        : "Successfully subscribed to our newsletter!",
      subscriptionType
    }
  } catch (error) {
    console.error("[v0] Error in subscribeUser:", error)
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}

/**
 * Legacy function - kept for backward compatibility
 * Use subscribeUser() instead for new implementations
 */
export async function addToNewsletter(
  email: string, 
  source: 'footer' | 'popup' | 'checkout' = 'footer'
) {
  return subscribeUser({ email, source })
}

/**
 * Server Action to unsubscribe an email from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
      .eq("email", email.toLowerCase())

    if (error) {
      console.error("[v0] Error unsubscribing:", error)
      return { success: false, message: "Something went wrong." }
    }

    return { success: true, message: "You've been unsubscribed." }
  } catch (error) {
    console.error("[v0] Error in unsubscribeFromNewsletter:", error)
    return { success: false, message: "Something went wrong." }
  }
}
