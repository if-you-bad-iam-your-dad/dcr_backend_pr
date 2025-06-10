const bcrypt = require('bcrypt');
const { KnexHms } = require('../config/db');
const moment = require('moment');


require('dotenv').config();

const tbluser = 'users'


exports.registerUser = async (req, res) => {
  try {
    const { user_name, password, user_role } = req.body;

    // Validate required fields
    if (!user_name || !password || !user_role) {
      return res.status(400).json({ message: 'Username, password, and user role are required' });
    }

    // Check if user already exists
    const existingUser = await KnexHms(tbluser).where({ user_name }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }   
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // if condition check the user role is admin or user based on that change is_admin value in insert query
    let is_admin = 0;
    if (user_role && user_role.toLowerCase() === 'admin') {
      is_admin = 1;
    } else if (user_role && user_role.toLowerCase() === 'user') {
      is_admin = 0;
    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    // Insert new user into the database
    await KnexHms(tbluser).insert({
      user_name,
      password: hashedPassword,
      is_admin,
      user_role,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
   
    // Return success response  
    return res.status(201).json({ message: 'User registered successfully'});
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // Validate required fields
    if (!user_name || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists
    const user = await KnexHms(tbluser).where({ user_name }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Return success response with user details
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        user_name: user.user_name,
        is_admin: user.is_admin,
        user_role: user.user_role,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}