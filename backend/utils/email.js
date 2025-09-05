require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("📧 Email module loaded...");

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // can be changed to smtp if needed
  auth: {
    user: process.env.EMAIL_USER,  // sender email (the one in .env)
    pass: process.env.EMAIL_PASS,  // app password
  },
});

// ✅ Verify transporter at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed!");
    console.error("🔍 Error:", error.message);
  } else {
    console.log("✅ Email transporter is ready to send messages!");
  }
});

const sendEmail = async (to, subject, text) => {
  console.log("\n==============================");
  console.log("📨 Preparing to send email...");
  console.log("➡️ From:", process.env.EMAIL_USER);
  console.log("➡️ To:", to);
  console.log("➡️ Subject:", subject);
  console.log("==============================");

  try {
    const info = await transporter.sendMail({
      from: `"Todo App 🚀" <${process.env.EMAIL_USER}>`, // nice display name
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully!");
    console.log("📩 Message ID:", info.messageId);

    if (info.accepted && info.accepted.length > 0) {
      console.log("📬 Accepted by:", info.accepted);
    }
    if (info.rejected && info.rejected.length > 0) {
      console.warn("⚠️ Rejected by:", info.rejected);
    }
    if (info.pending && info.pending.length > 0) {
      console.warn("⏳ Pending delivery to:", info.pending);
    }

    console.log("==============================\n");
    return true; // success
  } catch (error) {
    console.error("❌ Error sending email!");
    console.error("🔍 Error message:", error.message);
    console.error("🔍 Full error object:", error);
    console.log("==============================\n");
    return false; // failure
  }
};

module.exports = sendEmail;
