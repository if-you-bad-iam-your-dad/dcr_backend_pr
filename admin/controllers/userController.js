const bcrypt = require('bcrypt');
const { KnexHms } = require('../config/db');
const moment = require('moment');




const tbluser = 'users'


exports.registerUser = async (req, res) => {
  try {
    const { user_name, password, user_role, case_entry, case_view, analytics, chat } = req.body;
    // console.log(req.body);

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
      case_entry: case_entry || 0, // Default to 0 if not provided
      case_view: case_view || 0, // Default to 0 if not provided
      analytics: analytics || 0, // Default to 0 if not provided
      chat: chat || 0, // Default to 0 if not provided
  
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
   
    // Return success response  
    return res.status(201).json({ message: 'User registered successfully'});
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Login user function

exports.loginUser = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    // console.log(req.body);

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
        case_entry: user.case_entry,
        case_view: user.case_view,
        analytics: user.analytics,
        chat: user.chat
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get all users function


exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await KnexHms(tbluser).select('*');

    // Return success response with user details
    return res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// user update function
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL parameters
    const { user_name, password, user_role, case_entry, case_view, analytics, chat, updated_by } = req.body;
    // console.log(req.body);

    // Validate required fields
    if (!user_name || !user_role) {
      return res.status(400).json({ message: 'Username and user role are required' });
    }

    // Check if user exists
    const existingUser = await KnexHms(tbluser).where({ id }).first();
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update object
    const updateData = {
      user_name,
      user_role,
      case_entry: case_entry || 0,
      case_view: case_view || 0,
      analytics: analytics || 0,
      chat: chat || 0,
      updated_by,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    // Only hash and update password if provided
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update user in the database
    await KnexHms(tbluser).where({ id }).update(updateData);

    // Return success response
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// user delete function
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL parameters

    // Validate ID parameter
    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    // Check if the user exists
    const existingUser = await KnexHms(tbluser).where({ id }).first();
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await KnexHms(tbluser).where({ id }).del();

    // Return success response
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}