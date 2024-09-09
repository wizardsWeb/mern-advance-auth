import bcrypt from 'bcryptjs';
import crypto from 'crypto';  

import { User } from "../models/user.model.js";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetMail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import bcryptjs from 'bcryptjs';

const saltround = await bcrypt.genSalt(10)

const signup = async (req, res, next) => {
    
    const { email, password, name } = req.body;
    
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message: 'User already exits'})
        }

        const hashedPassword = await bcrypt.hash(password, saltround);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({ 
            email, 
            password: hashedPassword, 
            name,
            verificationToken,
            verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        await user.save();

        //jwt 
        generateTokenAndSetCookie(res, user._id );

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    }
    catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

const verifyEmail = async (req, res) => {

    const { code } = req.body;

    try {

        const user = await User.findOne( {
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if(!user) {
            return res.status(400).json({success: false, message: 'Invalid verification token'})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log(error)
    }

};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
    
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({success: false, message: 'Invalid email or password'});
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({success: false, message: 'Invalid credentials'});
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log(error);
    }
}   

const logout = async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" }); 
}

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });
        if(!user) {
           return res.status(400).json({ success: false, message:"message invalid email" })
        }

        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        //send Email


        await sendPasswordResetMail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Password reset link sent to your email"});

        res.status(200).json({
            success: true,
            message: 'Forget password mail successfully sent',
            user: {
                ...user._doc,
                password: undefined,
            }
        })
        
    } catch (error) {
        console.log(error)
    }
}

const resetPassword = async (req, res) => {
    try {
        
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token"});
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successfully"});

    } catch (error) {
        console.log(error)
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found"});
        }

        res.status(200).json({success: true, user});

    } catch (error) {
        
        console.log("Error in checkAuth", error);
        res.status(400).json({ success: false, message: error.message});

    }
}

export { signup, login, logout, verifyEmail, forgotPassword, resetPassword };