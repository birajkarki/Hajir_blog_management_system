import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    } 
  });

  const mailOptions = {
    from: options.email,
    to:process.env.SMTP_EMAIL,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};