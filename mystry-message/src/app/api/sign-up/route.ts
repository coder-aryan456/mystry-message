import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/db.connect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingUserverifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserverifiedByUsername) {
            return Response.json({
                success: false,
                message: "username is already exist",
            }, { status: 400 })
        }
        const existingUserByemail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByemail) {
            if (existingUserByemail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByemail.password = hashedPassword
                existingUserByemail.verifyCode = verifyCode
                existingUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByemail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            // console.log(username)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
            // send verification email
            // console.log(username)
            const emailresponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            ) // this line is sending me the email for verification of the code
            if (!emailresponse.success) {
                return Response.json({
                    success: false,
                    message: "Username is already taken"
                }, { status: 500 })
            }
        }
        // console.log("sdas")
        return Response.json({
            success: true,
            message: "User registered succesffuly please verify your email"
        }, { status: 200 })
    } catch (error) {
        console.error('error registry user', error)
        return Response.json(
            {
                success: false,
                message: "error registrring user"
            },
            {
                status: 500
            }
        )
    }
}