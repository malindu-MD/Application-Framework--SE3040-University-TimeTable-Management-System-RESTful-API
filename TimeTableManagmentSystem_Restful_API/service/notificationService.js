const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const CourseEnrollment = require("../models/courseEnrollmentModel");
const { EMAIL, PASSWORD, USEREMAIL } = require("./env.js");
const Mailgen = require("mailgen");

// Send notification to all enrolled students

async function sendNotificationToAllEnrolledStudents(courseID,recipients,subjects,message) {
  try {
  
    let config = {
      service: "gmail",
      auth: {
        user: 'dilshan773050254@gmail.com',
        pass: 'legzhbhpcajjrtpu',
      },
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });

    let response = {
      body: {
        name: 'Dear Student',
        intro: 'Module Code: '+ courseID + ' ' + message,
        action: {
            instructions: 'please click hear to view time table:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'View Time Table',
            }
        }
    }
    };

    let mail = MailGenerator.generate(response);

    recipients.forEach((recipient) => {

      console.log(recipient);

      const message = {
        from: 'dilshan773050254@gmail.com',
        to: recipient,
        subject: subjects,
        html: mail,
      };
    
      transporter.sendMail(message)
        .then(() => {
          console.log(`Email sent successfully to ${recipient}`);
        })
        .catch((error) => {
          console.error(`Error sending email to ${recipient}:`, error);
        });
    });


    
  } catch (error) {
    console.log(error);
  }
}




module.exports = { sendNotificationToAllEnrolledStudents };
