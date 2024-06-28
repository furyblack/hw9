import nodemailer from 'nodemailer';

export class NodemailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru', // Замените на ваш SMTP хост
            port: 465, // Замените на ваш SMTP порт
            secure: true, // true для 465, false для других портов
            auth: {
                user: 'miha25-2010@mail.ru', // Ваш email sergeev.miha@internet.ru
                pass: '5ZxK2mBji7EuM3yAxTeM', // Ваш пароль от email  simplepass11
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: 'miha25-2010@mail.ru', // Ваш email
            to,
            subject,
            text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

export const nodemailerService = new NodemailerService();
