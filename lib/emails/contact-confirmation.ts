interface ContactEmailData {
  customerName: string
  customerEmail: string
  subject: string
  message: string
  selectedExperiences?: string[]
  baseUrl?: string
}

export function buildContactNotificationEmail(data: ContactEmailData): string {
  const {
    customerName,
    customerEmail,
    subject,
    message,
    selectedExperiences,
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fougue.ae',
  } = data

  const experiencesBlock = selectedExperiences && selectedExperiences.length > 0
    ? `
      <tr>
        <td style="padding: 0 40px 24px 40px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FBF5EF;">
            <tr>
              <td style="padding: 20px 24px;">
                <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase;">
                  Interested In
                </p>
                ${selectedExperiences.map(exp =>
                  `<p style="margin: 4px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 14px; color: #1E1E1E;">&middot; ${exp}</p>`
                ).join('')}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    ` : ''

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Inquiry - Fougue</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FBF5EF; -webkit-font-smoothing: antialiased;">

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FBF5EF;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

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
                    New Inquiry
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Info -->
          <tr>
            <td style="padding: 40px 40px 8px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 22px; color: #1E1E1E; font-weight: 300; line-height: 1.4;">
                    From ${customerName}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #800913;">
                    <a href="mailto:${customerEmail}" style="color: #800913; text-decoration: none;">${customerEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: #FBF5EF; padding: 6px 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.15em; text-transform: uppercase;">
                          ${subject}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <div style="height: 1px; background-color: #f0ebe5;"></div>
            </td>
          </tr>

          ${experiencesBlock}

          <!-- Message -->
          <tr>
            <td style="padding: 24px 40px 40px 40px;">
              <p style="margin: 0 0 12px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase;">
                Message
              </p>
              <p style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 15px; color: #1E1E1E; line-height: 1.8; white-space: pre-wrap;">
                ${message}
              </p>
            </td>
          </tr>

          <!-- Reply Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${customerEmail}?subject=Re: ${subject} - Fougue" style="display: inline-block; padding: 14px 40px; background-color: #800913; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;">
                      Reply to ${customerName.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

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

export function buildContactClientEmail(data: ContactEmailData): string {
  const {
    customerName,
    subject,
    message,
    selectedExperiences,
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fougue.ae',
  } = data

  const firstName = customerName.split(' ')[0] || customerName

  const experiencesBlock = selectedExperiences && selectedExperiences.length > 0
    ? `
      <tr>
        <td style="padding: 0 40px 16px 40px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FBF5EF;">
            <tr>
              <td style="padding: 16px 24px;">
                <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase;">
                  Regarding
                </p>
                ${selectedExperiences.map(exp =>
                  `<p style="margin: 4px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 14px; color: #1E1E1E;">&middot; ${exp}</p>`
                ).join('')}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    ` : ''

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>We've received your message - Fougue</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FBF5EF; -webkit-font-smoothing: antialiased;">

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FBF5EF;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

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
                  <td style="padding-top: 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #1E1E1E; opacity: 0.55; line-height: 1.7;">
                    We have received your message and our team will get back to you shortly. Below is a copy of your inquiry for your records.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <div style="height: 1px; background-color: #f0ebe5;"></div>
            </td>
          </tr>

          ${experiencesBlock}

          <!-- Message Copy -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #800913; letter-spacing: 0.2em; text-transform: uppercase; padding-bottom: 12px;">
                    Your Message &middot; ${subject}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 24px; background-color: #FBF5EF; font-family: 'Georgia', 'Times New Roman', serif; font-size: 14px; color: #1E1E1E; opacity: 0.7; line-height: 1.8; white-space: pre-wrap; font-style: italic;">
                    ${message}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 32px 40px 0 40px;">
              <div style="height: 1px; background-color: #f0ebe5;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 40px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #1E1E1E; opacity: 0.55; line-height: 1.8; text-align: center;">
                    In the meantime, feel free to reach us anytime.<br/>
                    <a href="https://wa.me/971523157273" style="color: #800913; text-decoration: none;">WhatsApp</a>
                    &nbsp;&middot;&nbsp;
                    <a href="mailto:hello@fougue.ae" style="color: #800913; text-decoration: none;">hello@fougue.ae</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

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
