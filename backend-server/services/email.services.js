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
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
        const verificationUrl = `${CLIENT_URL}/verify-account/${verificationToken}`;

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Xác minh tài khoản của bạn',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Chào mừng ${username}!</h2>
                    <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng xác minh địa chỉ email của bạn.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Xác minh tài khoản
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Nếu bạn không thể nhấp vào nút trên, hãy sao chép và dán liên kết sau vào trình duyệt:
                        <br><a href="${verificationUrl}">${verificationUrl}</a>
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Liên kết này sẽ hết hạn sau 24 giờ.
                    </p>
                    <p style="color: #666; font-size: 12px;">
                        Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
                    </p>
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
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
        const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Đặt lại mật khẩu</h2>
                    <p>Chào ${username},</p>
                    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Nếu bạn không thể nhấp vào nút trên, hãy sao chép và dán liên kết sau vào trình duyệt:
                        <br><a href="${resetUrl}">${resetUrl}</a>
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Liên kết này sẽ hết hạn sau 1 giờ.
                    </p>
                    <p style="color: #666; font-size: 12px;">
                        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
                    </p>
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
