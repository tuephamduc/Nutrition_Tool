import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = 'hdsahjdsajh223jasjd';


// console.log(process.env.GMAIL_USER);
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export const mailOption = (sendto, subject, text) => {
  return {
    from: process.env.GMAIL_USER,
    to: sendto,
    subject: subject,
    html: text
  }
}