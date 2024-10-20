import nodemailer from "nodemailer";
import xoauth2 from "xoauth2";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "huyhg2521@gmail.com",
    pass: "lfykcwjjxrwlseur",
  },
});

const templates = {
  verifyUser: (verificationLink) => `
          <h1>Email Verification</h1>
          <p>Thank you for registering. Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>If you didn't register, please ignore this email.</p>
        `,
  paymentSuccess: () => `
        <h1>Payment</h1>
        <p>Thank you for payment. Have a good day</p>
`,
  // You can add more templates here if needed
};

/**
 * @param {string} to
 * @param {string} subject
 */
export const sendPaymentSuccessMail = (to, subject) => {
  const mailOptions = {
    to,
    subject: subject,
    html: templates.paymentSuccess(),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

/**
 * @param {string} to
 * @param {string} userId
 * @param {string} code
 * @param {string} subject
 */
export const sendVerificationEmail = (
  to,
  userId,
  code,
  subject,
  templateKey
) => {
  const verificationLink = `http://localhost:3000/auth/verify?code=${code}&id=${userId}`;
  const template = templates[templateKey];

  if (!template) {
    throw new Error(`Invalid template key: ${templateKey}`);
  }

  const mailOptions = {
    to,
    subject: subject,
    html: template(verificationLink),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
