// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.API_KEY);
// const User = require('../models/Users/user')
// const tokenForUser = require('../utils/tokengenerator');
// // Send email that contains a link for reset pwd
// exports.send = async (req, res) => {
//   const user = await User.findOne({ email: req.body.email }) // find user
//   console.table(user)
//   if (user) { // if we fond the user
//     const token = tokenForUser(user) // generates new token
//     user.resettoken = token // affecting token to the user
//     await user.save() // saving the user
//     const link = `${req.protocol}://localhost:3000/resetpwd?token=${token}` // generating link
//     await h,.send({
//       to: req.body.email,
//       from: 'mazouzi2002@gmail.com',
//       subject: 'Reset password',
//       html:
//         `<div>Click the link below to reset your password</div>
//         <br/>
//         <div>${link}</div>`
//     }) // sending the email
//       .then(data => res.send({ result: data }))
//       .catch(err => res.send(err))
//   }
//   else { // user not found
//     res.status(404).send({ message: 'User not found !' })
//   }
// }

// exports.resetPassword = async (req, res) => {
//   const { newPassword, token } = req.body
//   const user = await User.findOne({ resettoken: token })
//   if (user) {
//     user.password = newPassword
//     await user.save()
//     return res.send({ message: "Password updated successfully !" })
//   }
//   res.status(404).send({ message: `User not found !` })
// }
const nodemailer = require('nodemailer');
const User = require('../models/Users/user');
const tokenForUser = require('../utils/tokengenerator');
const { json } = require('express');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD // Your email password or App Password
  }
});

// Send email that contains a link for reset password
exports.send = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // Find user
    console.table(user);
    if (user) { // If we found the user
     
      const token = tokenForUser(user); // Generate new token
   
      user.resettoken = token; // Assign token to the user
      
      try {
        
        user.save().then(
          user => {
            res.status(200).json(user);
           
          }).catch(err => {
           
            res.status(500).json("Server error", err);

          }); // Save the user

       
      } catch (saveError) {
        console.log("user not saved", saveError); // 
      }
      

      const link = `${req.protocol}://localhost:3000/resetpwd/${token}`; // Generate reset link
      // Prepare email options
      const mailOptions = {
        to: req.body.email,
        from: 'seasos194@gmail.com',
        subject: 'Reset password',
        html: `
          <div>Click the link below to reset your password:</div>
          <br/>
          <div>${link}</div>`
      };

      // Send email using Nodemailer
      await transporter.sendMail(mailOptions);
      res.send({ message: 'Reset email sent successfully!' });
    } else { // User not found
      res.status(404).send({ message: 'User not found!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error sending reset email.' });
  }
};



exports.resetPasword =  (req, res) => {
  try {
    const { newPassword, token } = req.body;
    
    const user =  User.findOne({ resettoken: req.body.token });
    
    
   
    if (user) {
      
      user.password = newPassword;
      try {
        
        user.save().then(
          user => {
            res.status(200).json(user);
          }).catch(err => {
            
            res.status(500).json("Server error", err);

          }); // Save the user
          
      } catch (saveError) {
        console.log("user not saved", saveError); // 
      }
      console.log("user saved")
      return res.send({ message: "Password updated successfully!" });
    }
    else {
      res.status(404).send({ message: 'User not found!' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error resetting password.' });
  }
};
