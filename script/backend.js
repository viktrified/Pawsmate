const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

app.post("/send-email", (req, res) => {
  const { email, code } = req.body;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Failed to send email");
    }
    res.send("Email sent successfully!");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
