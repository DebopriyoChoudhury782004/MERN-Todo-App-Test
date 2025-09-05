// test-email.js
const sendEmail = require("./utils/email");

(async () => {
  const result = await sendEmail(
    "shridebopriyo@gmail.com",   // 👈 replace with YOUR Gmail
    "Nodemailer Test 🚀",
    "Hey Debopriyo! This is a test email sent from your MERN app backend."
  );

  if (result) {
    console.log("✅ Email delivery attempt succeeded.");
  } else {
    console.log("❌ Email delivery attempt failed.");
  }
})();
