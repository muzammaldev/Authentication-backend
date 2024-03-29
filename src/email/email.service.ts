import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'muzammaldev@gmail.com',
        pass: 'ppcaqyujygfeiiip',
      },
      secure: true,
    });
  }

  async sendMail(to: string, text: string) {
    const mailOptions = {
      from: 'muzammaldev@gmail.com',
      to,
      text,
    };

    try {
      this.transporter.sendMail(mailOptions);
      console.log('Email sent successFully');
    } catch (error) {
      console.log('Error sending Mail', error);
      throw error;
    }
  }
}
