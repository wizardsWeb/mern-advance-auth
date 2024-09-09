import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
	},
	{ timestamps: true } // createdAt and updatedAt fields are added to the 
);

export const User = mongoose.model("User", userSchema);  