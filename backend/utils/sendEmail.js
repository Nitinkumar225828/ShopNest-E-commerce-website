const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const emailUser = (
      process.env.EMAIL_USER ||
      process.env.Email_USER ||
      ""
    ).trim();

    const emailPass = (
      process.env.EMAIL_PASS ||
      process.env.Email_PASS ||
      process.env.GMAIL_PASS ||
      ""
    )
      .replace(/\s+/g, "")
      .trim();

    if (!emailUser || !emailPass) {
      throw new Error(
        "Email credentials are missing. Check EMAIL_USER and EMAIL_PASS in Render."
      );
    }

    // Gmail SMTP Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      family: 4, // Force IPv4 (fixes ENETUNREACH on Render)
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP Connected Successfully");

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
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
