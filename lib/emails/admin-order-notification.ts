interface OrderItem {
  title: string
  price: number
  quantity: number
  type: 'product' | 'experience'
  experienceDate?: string
  experienceTime?: string
  guests?: number
  addons?: { id: string; name: string; price: number }[]
}

interface AdminOrderData {
  customerName: string
  customerEmail: string
  orderId?: string
  bookingIds?: string[]
  items: OrderItem[]
  totalAmount: number
  currency: string
  hasExperiences: boolean
  receiptUrl?: string
  baseUrl?: string
}

export function buildAdminOrderNotificationEmail(data: AdminOrderData): string {
  const {
    customerName,
    customerEmail,
    orderId,
    bookingIds,
    items,
    totalAmount,
    currency,
    hasExperiences,
    receiptUrl,
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fougue.ae',
  } = data

  const itemsHtml = items.map(item => {
    const itemTotal = item.type === 'experience' && item.addons
      ? item.price * item.quantity + item.addons.reduce((s, a) => s + a.price, 0)
      : item.price * item.quantity

    let detailsHtml = ''
    if (item.type === 'experience') {
      if (item.experienceDate) detailsHtml += `<span style="display:inline-block; margin-right:16px;">Date: ${item.experienceDate}</span>`
      if (item.experienceTime) detailsHtml += `<span style="display:inline-block; margin-right:16px;">Heure: ${item.experienceTime}</span>`
      if (item.guests) detailsHtml += `<span style="display:inline-block;">Personnes: ${item.guests}</span>`
    }
    if (item.addons && item.addons.length > 0) {
      detailsHtml += `<br/><span style="color:#800913;">Add-ons: ${item.addons.map(a => `${a.name} (${currency} ${a.price})`).join(', ')}</span>`
    }

    return `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #E5E5E5;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: #1E1E1E; font-weight: 500;">
                ${item.title}
                ${item.type === 'experience' ? '<span style="display:inline-block; margin-left:8px; background:#800913; color:#fff; font-size:10px; padding:2px 6px; text-transform:uppercase; letter-spacing:0.05em;">Experience</span>' : '<span style="display:inline-block; margin-left:8px; background:#1E1E1E; color:#fff; font-size:10px; padding:2px 6px; text-transform:uppercase; letter-spacing:0.05em;">Produit</span>'}
              </td>
              <td align="right" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: #1E1E1E; font-weight: 600;">
                ${currency} ${itemTotal.toLocaleString('en-US')}
              </td>
            </tr>
            ${detailsHtml ? `<tr><td colspan="2" style="padding-top:6px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #666;">${detailsHtml}</td></tr>` : ''}
            <tr>
              <td colspan="2" style="padding-top:4px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #999;">
                Qty: ${item.quantity}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background-color: #F5F0EB; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F0EB;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">

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
                      <td align="center" style="padding-top: 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #ffffff; letter-spacing: 0.3em; text-transform: uppercase;">
                        Admin Notification
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Alert Banner -->
              <tr>
                <td style="padding: 20px 40px; background-color: #800913;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 20px; color: #ffffff; text-align: center;">
                        ${hasExperiences ? 'Nouvelle reservation' : 'Nouvelle commande'}${orderId ? ` #${orderId}` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- White Card -->
              <tr>
                <td style="background-color: #ffffff; padding: 40px;">

                  <!-- Customer Info -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; background-color: #FBF5EF; padding: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase; padding-bottom: 12px;">
                              Informations client
                            </td>
                          </tr>
                          <tr>
                            <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: #1E1E1E; font-weight: 600; padding-bottom: 4px;">
                              ${customerName}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #666;">
                              <a href="mailto:${customerEmail}" style="color: #800913; text-decoration: none;">${customerEmail}</a>
                            </td>
                          </tr>
                          ${bookingIds && bookingIds.length > 0 ? `
                          <tr>
                            <td style="padding-top: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #999;">
                              Booking ID(s): ${bookingIds.join(', ')}
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Items -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase; padding-bottom: 16px;">
                        Detail de la commande
                      </td>
                    </tr>
                    ${itemsHtml}
                  </table>

                  <!-- Total -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px solid #1E1E1E; padding-top: 16px;">
                    <tr>
                      <td style="padding-top: 16px; font-family: 'Georgia', 'Times New Roman', serif; font-size: 14px; color: #1E1E1E; text-transform: uppercase; letter-spacing: 0.1em;">
                        Total
                      </td>
                      <td align="right" style="padding-top: 16px; font-family: 'Georgia', 'Times New Roman', serif; font-size: 22px; color: #800913; font-weight: 600;">
                        ${currency} ${totalAmount.toLocaleString('en-US')}
                      </td>
                    </tr>
                  </table>

                  ${receiptUrl ? `
                  <!-- Stripe Receipt -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px;">
                    <tr>
                      <td align="center" style="padding-top: 16px;">
                        <a href="${receiptUrl}" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #800913; text-decoration: underline;">
                          Voir le recu Stripe
                        </a>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- Action Buttons -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 0 8px;">
                              <a href="${baseUrl}/admin/orders" style="display: inline-block; padding: 14px 28px; background-color: #1E1E1E; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase;">
                                Voir les commandes
                              </a>
                            </td>
                            <td style="padding: 0 8px;">
                              <a href="mailto:${customerEmail}" style="display: inline-block; padding: 14px 28px; background-color: #800913; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase;">
                                Contacter le client
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px; background-color: #1E1E1E;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #ffffff60; padding-bottom: 8px;">
                        Fougue. Admin Notification
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #ffffff40;">
                        Cet email est genere automatiquement.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
