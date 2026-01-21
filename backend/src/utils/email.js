import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Debug: Log environment variables
    console.log(" Email Config Debug:");
    console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || ' NOT SET'}`);
    console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || ' NOT SET'}`);
    console.log(`   EMAIL_USERNAME: ${process.env.EMAIL_USERNAME || ' NOT SET'}`);
    console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? ' SET' : ' NOT SET'}`);

    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Code Practice Support <support@codepractice.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || options.message
    };

    // If no email credentials configured
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        console.warn("  Email credentials not configured. Email sending disabled.");
        console.log(" Email Details (Development Mode):");
        console.log(`   To: ${options.email}`);
        console.log(`   Subject: ${options.subject}`);
        console.log(`   Message: ${options.message.substring(0, 100)}...`);
        console.log("\n Configure EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD in .env to send real emails");
        
        // In development, we still proceed without sending
        return { success: true, message: "Email would be sent (dev mode)" };
    }

    // 3) Actually send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(` Email sent successfully to ${options.email}`);
        console.log(`   Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(" Email send failed:", error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;
