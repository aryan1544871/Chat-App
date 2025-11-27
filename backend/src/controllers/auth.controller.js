import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {generateToken} from '../lib/utils.js';
import cloudinary from '../lib/cloudnary.js';
import axios from 'axios';

export const signup = async (req, res) => {
 const {email, fullName, password} = req.body;
 try{
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const user = await User.findOne({ email });
    if (user) { return res.status(400).json({ message: 'User already exists' }); }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =  await bcrypt.hash(password, salt);
    const newUser = new User({ email, fullName, password: hashedPassword });
    if (newUser){
        generateToken(newUser._id, res);
        await newUser.save();
        const sendData = {
            email: 'aryan.mnitj@gmail.com',
            subject: 'New User Signup for your Chat App',
            body: `A new user has signed up with the email: ${newUser.email} and name: ${newUser.fullName}`
          };

          axios.patch(`https://auth-project-swart.vercel.app/api/email/send`, sendData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(response => {
              console.log('Email sent:', response.data);
             
            })
            .catch(error => {
              console.error('Error sending email:', error);
            });
         return res.status(201).json({_id: newUser._id, email: newUser.email, fullName: newUser.fullName, profilePic: newUser.profilePic});   
      }
    else{
        return res.status(400).json({ message: 'Invalid user data' });
    }
 }
 catch(error){
   console.log('Error in signup controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
 }
}
export const signin = async (req, res) => {
  const {email, password} = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    generateToken(user._id, res);
    return res.status(200).json({_id: user._id, email: user.email, fullName: user.fullName, profilePic: user.profilePic});
  } 
  catch (error) {
    console.log('Error in signin controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const signout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    return res.status(200).json({ message: 'Signout successful' });
  } catch (error) {
    console.log('Error in signout controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new : true});
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Error in updateProfile controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
    
  }

}
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);

  } catch (error) {
    console.log('Error in checkAuth controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}