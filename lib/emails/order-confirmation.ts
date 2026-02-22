interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  type: 'product' | 'experience'
  experienceDate?: string
  experienceTime?: string
  guests?: number
  addons?: { id: string; name: string; price: number }[]
}

interface OrderConfirmationData {
  customerName: string
  customerEmail: string
  orderId?: string
  bookingIds?: string[]
  items: OrderItem[]
  totalAmount: number
  currency: string
  receiptUrl?: string
  hasExperiences: boolean
  baseUrl?: string
}

export function buildOrderConfirmationEmail(data: OrderConfirmationData): string {
  const {
    customerName,
    orderId,
    bookingIds,
    items,
    totalAmount,
    currency,
    receiptUrl,
    hasExperiences,
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fougue.ae',
  } = data

  const firstName = customerName.split(' ')[0] || customerName
  const products = items.filter(i => i.type === 'product')
  const experiences = items.filter(i => i.type === 'experience')

  const formatPrice = (amount: number) => `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`

  // Build product rows
  const productRows = products.map(item => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #f0ebe5;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 15px; color: #1E1E1E; line-height: 1.4;">
              ${item.title}
              <br/>
              <span style="font-size: 13px; color: #1E1E1E; opacity: 0.5;">Qty: ${item.quantity}</span>
            </td>
            <td align="right" style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 15px; color: #800913; vertical-align: top; white-space: nowrap;">
              ${formatPrice(item.price * item.quantity)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  // Build experience rows
  const experienceRows = experiences.map(exp => {
    const addonTotal = exp.addons?.reduce((s, a) => s + a.price, 0) || 0
    const expTotal = exp.price + addonTotal

    const addonLines = exp.addons?.map(a =>
      `<span style="display: inline-block; margin-right: 12px; font-size: 12px; color: #1E1E1E; opacity: 0.5;">+ ${a.name} (${formatPrice(a.price)})</span>`
    ).join('') || ''

    return `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #f0ebe5;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 15px; color: #1E1E1E; line-height: 1.6;">
              ${exp.title}
              <br/>
              <span style="font-size: 13px; color: #1E1E1E; opacity: 0.5;">
                ${exp.experienceDate ? `${exp.experienceDate}` : ''}${exp.experienceTime ? ` &middot; ${exp.experienceTime}` : ''}${exp.guests ? ` &middot; ${exp.guests} guests` : ''}
              </span>
              ${addonLines ? `<br/>${addonLines}` : ''}
            </td>
            <td align="right" style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 15px; color: #800913; vertical-align: top; white-space: nowrap;">
              ${formatPrice(expTotal)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    `
  }).join('')

  // Reference line
  const refLine = [
    orderId ? `Order ${orderId}` : null,
    bookingIds?.length ? bookingIds.map(b => `Booking ${b}`).join(', ') : null,
  ].filter(Boolean).join('  |  ')

  // Invoice button
  const invoiceBlock = receiptUrl ? `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 32px;">
      <tr>
        <td align="center">
          <a href="${receiptUrl}" target="_blank" style="display: inline-block; padding: 14px 40px; background-color: #1E1E1E; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;">
            Download Invoice
          </a>
        </td>
      </tr>
    </table>
  ` : ''

  // Contact section
  const contactSection = hasExperiences
    ? `
      <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #1E1E1E; opacity: 0.55; line-height: 1.8; text-align: center;">
        Questions about your experience?<br/>
        <a href="https://wa.me/971523157273" style="color: #800913; text-decoration: none;">WhatsApp</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:hello@fougue.ae" style="color: #800913; text-decoration: none;">hello@fougue.ae</a>
      </td>
    `
    : `
      <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #1E1E1E; opacity: 0.55; line-height: 1.8; text-align: center;">
        Questions about your order?<br/>
        <a href="mailto:hello@fougue.ae" style="color: #800913; text-decoration: none;">hello@fougue.ae</a>
      </td>
    `

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation - Fougue</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FBF5EF; -webkit-font-smoothing: antialiased;">

  <!-- Outer wrapper -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FBF5EF;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Main card -->
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; background-color: #ffffff;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 48px 40px 32px 40px; background-color: #1E1E1E;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="${baseUrl}/images/fougue-logo-white-transparent.png" alt="Fougue." width="140" style="display: block; height: auto;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 24px;">
                    <div style="width: 40px; height: 1px; background-color: #800913;"></div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #ffffff; opacity: 0.4; letter-spacing: 0.2em; text-transform: uppercase;">
                    Order Confirmation
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 8px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 22px; color: #1E1E1E; font-weight: 300; line-height: 1.4;">
                    Thank you, ${firstName}.
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1E1E1E; opacity: 0.55; line-height: 1.6;">
                    Your order has been confirmed. Here is a summary of what awaits you.
                  </td>
                </tr>
                ${refLine ? `
                <tr>
                  <td style="padding-top: 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #1E1E1E; opacity: 0.35; letter-spacing: 0.05em;">
                    ${refLine}
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 20px 40px 0 40px;">
              <div style="height: 1px; background-color: #f0ebe5;"></div>
            </td>
          </tr>

          ${products.length > 0 ? `
          <!-- Products Section -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase; padding-bottom: 12px;">
                    Products
                  </td>
                </tr>
                ${productRows}
              </table>
            </td>
          </tr>
          ` : ''}

          ${experiences.length > 0 ? `
          <!-- Experiences Section -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase; padding-bottom: 12px;">
                    Experiences
                  </td>
                </tr>
                ${experienceRows}
              </table>
            </td>
          </tr>

          <!-- Curation note -->
          <tr>
            <td style="padding: 20px 40px 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FBF5EF;">
                <tr>
                  <td style="padding: 20px 24px; font-family: 'Georgia', 'Times New Roman', serif; font-size: 13px; color: #1E1E1E; opacity: 0.6; line-height: 1.7; font-style: italic; text-align: center;">
                    We will personally connect with you to refine the intimate details of your experience &mdash; so the moment feels unmistakably yours.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Total -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 16px 0; border-top: 2px solid #1E1E1E;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #1E1E1E; letter-spacing: 0.15em; text-transform: uppercase;">
                          Total
                        </td>
                        <td align="right" style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 20px; color: #800913; font-weight: 400;">
                          ${formatPrice(totalAmount)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${invoiceBlock ? `
          <!-- Invoice Button -->
          <tr>
            <td style="padding: 8px 40px 0 40px;">
              ${invoiceBlock}
            </td>
          </tr>
          ` : ''}

          <!-- Contact -->
          <tr>
            <td style="padding: 40px 40px 0 40px;">
              <div style="height: 1px; background-color: #f0ebe5;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 40px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  ${contactSection}
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End main card -->

        <!-- Footer -->
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px;">
          <tr>
            <td align="center" style="padding: 32px 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #1E1E1E; opacity: 0.3; line-height: 1.6;">
              Fougue &middot; Dubai, UAE<br/>
              Curated romantic experiences &amp; gifts
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}
