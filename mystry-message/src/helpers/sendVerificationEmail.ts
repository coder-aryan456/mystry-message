import {resend} from "../lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { Apiresponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
   email:string,
   username:string,
   verifycode:string
): Promise<Apiresponse>{
    try {
       await resend.emails.send({
        from:'onboarding@resend.dev',
        to:'email',
        subject:'Mystry message | Verification code',
        react:VerificationEmail({username,otp:verifycode})
       });
       return {success:true,message:'verification email send succesfully'}
    } catch (error) {
        console.error("error sending verification email")
        return {success:false,message:'Failed to send verification email'}

    }
}