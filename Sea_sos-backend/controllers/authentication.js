const User = require('../models/Users/user');
const bcrypt = require("bcryptjs");
const tokenForUser = require('../utils/tokengenerator');

// Sign in
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      
      return res.send({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
  
      return res.send({ message: 'Incorrect password or email' });
    }

    const auth = bcrypt.compare(password, user.password);
    if (!auth) {
    
      return res.send({ message: 'Incorrect password or email' });
    }

    // Check for patrol supervisor or admin role
    if (user.role !== 'patrol_supervisor' && user.role !== 'ADMIN') {
      
      return res.status(403).send({ message: 'Access forbidden: Only supervisors and admins can log in here' });
    }

    const token = tokenForUser(user);
    

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.send({ message: "User logged in successfully", token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: error.message });
  }
}