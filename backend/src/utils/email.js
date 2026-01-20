import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Code Practice Support <support@codepractice.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html 
    };

    if (!process.env.EMAIL_HOST) {
        console.log("Mock Email Sent (No Credentials):");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        return;
    }

    // 3) Actually send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
    } catch (error) {
        console.error("Email send failed:", error);
        // In dev, we might want to throw to let the controller know, 
        // or just log it if we want to proceed for testing without credentials
        throw error;
    }
};

export default sendEmail;
