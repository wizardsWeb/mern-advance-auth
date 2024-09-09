import { MailtrapClient } from 'mailtrap';
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js'
import { mailTrapClient, sender } from './mailtrap.config.js'


export const sendVerificationEmail = async (email, verificationToken) => {
    const recepient = [{email}];

    try {
        const response = await mailTrapClient.send({
            from:sender,
            to: recepient,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log("Email Sent successfully", response)
    }
    catch (error) {
        console.error(`Error sending verfication`,  error)
        throw new Error(`Error sending verfication email: ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recepient = [{email}];
    
    try {
        
        const response = await mailTrapClient.send({
            from: sender,
            to: recepient,
            template_uuid: "0fcd438b-7700-4043-bad1-f5315c98268a",
            template_variables: {
                "company_info_name": "Auth - Compamy",
                "name": name
              }
            });

        console.log("Welcome Email sent successfully", response);

    } catch (error) {
            console.error(`Error sending welcome email`, error);    
            throw new Error(`Error sending welcome email: ${error}`);
    }
}

export const sendPasswordResetMail = async (email, resetURL) => {
    const recepient = [{email}];

    try {
        
        const response = await mailTrapClient.send({
            from: sender,
            to: recepient,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: 'Forget Password mail'
        })

        console.log("password reset link has been send successfully");

    } catch (error) {
        console.error(`Error sending welcome email`, error);    
        throw new Error(`Error sending welcome email: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset Success',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Reset success'
        });

        console.log("Password reset email send successfully", response);

    } catch (error) {
        console.error("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
}