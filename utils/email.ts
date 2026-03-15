import { Resend } from 'resend';
import { escapeHtml } from './sanitize';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'Prop PNL <noreply@yourdomain.com>';

export interface SendCompletionEmailParams {
  to: string;
  individualName: string;
  requestedByName: string;
  verificationLink: string;
}

/**
 * Send completion notification email to landlord
 */
export async function sendCompletionEmail(params: SendCompletionEmailParams) {
  const { to, individualName, requestedByName, verificationLink } = params;

  // Escape all user-provided input for HTML
  const safeIndividualName = escapeHtml(individualName);
  const safeRequestedByName = escapeHtml(requestedByName);

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Income verification completed for ${individualName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Verification Complete</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; margin-top: 0;">Hello ${safeRequestedByName},</p>
              
              <p style="font-size: 16px;">
                Great news! <strong>${safeIndividualName}</strong> has completed their income verification.
              </p>
              
              <p style="font-size: 16px;">
                You can now view the complete income verification report, including:
              </p>
              
              <ul style="font-size: 16px; padding-left: 20px;">
                <li>12-month transaction history</li>
                <li>Monthly income estimates</li>
                <li>Account balances</li>
                <li>Recurring deposit patterns</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" 
                   style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  View Report
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">Powered by Income Verifier</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    throw error;
  }
}
