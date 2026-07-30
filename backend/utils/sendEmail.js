const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const emailUser = (process.env.EMAIL_USER || "").trim();
    const emailPass = (process.env.EMAIL_PASS || "").trim();

    if (!emailUser || !emailPass) {
      throw new Error("EMAIL_USER or EMAIL_PASS is missing in environment variables.");
    }

    // Brevo SMTP Configuration
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ Brevo SMTP Connected Successfully");

    const mailOptions = {
      from: `"ShopNest" <${emailUser}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
