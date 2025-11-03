import { transporter } from "../config/email.config.js";

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: `"TV Course Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Xác thực tài khoản của bạn",
      text: `Mã xác thực của bạn là: ${verificationCode}. Mã này có hiệu lực trong 15 phút.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                        Xác thực tài khoản
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                        Xin chào,
                      </p>
                      <p style="margin: 0 0 32px; color: #374151; font-size: 16px; line-height: 1.6;">
                        Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã xác thực bên dưới để hoàn tất quá trình đăng ký:
                      </p>
                      
                      <!-- Verification Code Box -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 24px; background-color: #F0F4FF; border-radius: 8px; border: 2px dashed #1E40AF;">
                            <div style="font-size: 42px; font-weight: 700; color: #1E40AF; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${verificationCode}
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 32px 0 0; color: #6B7280; font-size: 14px; line-height: 1.6; text-align: center;">
                        <strong style="color: #1E40AF;">⏱️ Mã này có hiệu lực trong 15 phút</strong>
                      </p>
                      
                      <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #E5E7EB;">
                        <p style="margin: 0 0 12px; color: #6B7280; font-size: 14px; line-height: 1.6;">
                          <strong>Lưu ý:</strong>
                        </p>
                        <ul style="margin: 0; padding-left: 20px; color: #6B7280; font-size: 14px; line-height: 1.8;">
                          <li>Không chia sẻ mã này với bất kỳ ai</li>
                          <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                      <p style="margin: 0 0 8px; color: #6B7280; font-size: 14px;">
                        Trân trọng,
                      </p>
                      <p style="margin: 0; color: #1E40AF; font-size: 16px; font-weight: 600;">
                        Đội ngũ TV Course Platform
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
                <!-- Bottom Text -->
                <table width="600" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                        Email này được gửi tự động, vui lòng không trả lời.
                      </p>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Không thể gửi email xác thực. Vui lòng thử lại sau.");
  }
};
