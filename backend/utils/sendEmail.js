const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const emailUser = (process.env.Email_USER || process.env.EMAIL_USER || "").trim();
    const emailPass = (process.env.Email_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS || "")
      .replace(/\s+/g, "")
      .trim();

    if (!emailUser || !emailPass) {
      throw new Error("Email credentials are missing. Check Email_USER/EMAIL_USER and Email_PASS/EMAIL_PASS in your .env file.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `ShopNest <${emailUser}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message || error);
    throw error;
  }
};

module.exports = sendEmail;
