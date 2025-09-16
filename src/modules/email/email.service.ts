import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST, // e.g. smtp.postmarkapp.com / email-smtp.us-east-1.amazonaws.com
//   port: Number(process.env.SMTP_PORT) || 587,
//   secure: false,
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
// });

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('app.gmailUser'),
        pass: this.configService.get('app.gmailPass'),
      },
    });
  }

  async sendPasswordReset(
    to: string,
    params: {
      username: string;
      resetLink: string;
      mobileLink: string;
      expiresInMinutes: number;
    },
  ) {
    const subject = 'Reset your Monolingo password';

    const html = `
          <p>Hi ${params.username},</p>
          <p>You requested a password reset. This link expires in ${params.expiresInMinutes} minutes.</p>
          <p><a href="${params.resetLink}">Reset password on web</a></p>
          <p>If you're on mobile, tap: <a href="${params.mobileLink}">${params.mobileLink}</a></p>
          <p>If you didn't request this, you can ignore this email.</p>
        `;

    await this.transporter?.sendMail({
      from: 'Monolingo <no-reply@monolingo.com>',
      to: to,
      subject: subject,
      html: html,
    });
  }
}
