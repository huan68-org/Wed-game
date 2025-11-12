const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });
    }

    async sendVerificationEmail(email, username, verificationToken) {
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
        const verificationUrl = `${BACKEND_URL}/api/auth/verify-email/${verificationToken}`;

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Xác minh tài khoản - Game Hub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🎮 Game Hub</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Chào mừng bạn đến với cộng đồng game!</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">Xin chào ${username}!</h2>
                        <p style="color: #666; line-height: 1.6; font-size: 16px;">
                            Cảm ơn bạn đã đăng ký tài khoản Game Hub. Để hoàn tất quá trình đăng ký và bắt đầu trải nghiệm các trò chơi thú vị, vui lòng xác minh địa chỉ email của bạn.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; 
                                      padding: 15px 30px; 
                                      text-decoration: none; 
                                      border-radius: 25px; 
                                      font-weight: bold; 
                                      font-size: 16px;
                                      display: inline-block;
                                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                ✅ Xác minh tài khoản
                            </a>
                        </div>
                        
                        <p style="color: #999; font-size: 14px; line-height: 1.5;">
                            <strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 24 giờ. Nếu bạn không thể nhấp vào nút trên, hãy sao chép và dán liên kết sau vào trình duyệt:
                        </p>
                        <p style="color: #667eea; font-size: 14px; word-break: break-all; background: #f8f9ff; padding: 10px; border-radius: 5px;">
                            ${verificationUrl}
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        <p>© 2024 Game Hub. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Không thể gửi email xác minh');
        }
    }

    async sendPasswordResetEmail(email, username, resetToken) {
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
        const resetUrl = `${BACKEND_URL}/api/auth/reset-password/${resetToken}`;

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Đặt lại mật khẩu - Game Hub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Game Hub</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Yêu cầu đặt lại mật khẩu</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">Xin chào ${username}!</h2>
                        <p style="color: #666; line-height: 1.6; font-size: 16px;">
                            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                                      color: white; 
                                      padding: 15px 30px; 
                                      text-decoration: none; 
                                      border-radius: 25px; 
                                      font-weight: bold; 
                                      font-size: 16px;
                                      display: inline-block;
                                      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);">
                                🔑 Đặt lại mật khẩu
                            </a>
                        </div>
                        
                        <p style="color: #999; font-size: 14px; line-height: 1.5;">
                            <strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 1 giờ vì lý do bảo mật. Nếu bạn không thể nhấp vào nút trên, hãy sao chép và dán liên kết sau vào trình duyệt:
                        </p>
                        <p style="color: #ef4444; font-size: 14px; word-break: break-all; background: #fef2f2; padding: 10px; border-radius: 5px;">
                            ${resetUrl}
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        <p>© 2024 Game Hub. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Không thể gửi email đặt lại mật khẩu');
        }
    }
}

module.exports = new EmailService();
