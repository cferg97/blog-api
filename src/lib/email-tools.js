import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.EMAIL_API);

export const sendPostEmail = async (email) => {
  const msg = {
    to: email,
    from: "c.ferguson1997@gmail.com",
    subject: "You created a new post",
    text: "Congrats! You submitted a new blog post.",
    html: "<strong>Congratulations! You submitted a new blog post!</strong>",
  };
  let sent = await sgMail.send(msg);
  console.log(sent);
};
