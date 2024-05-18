import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/db.connect";
import UserModel from "@/model/User";
import { User } from "next-auth";
export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            {
                status: 401
            }
        )
    }
    const userId = user._id;
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages
            },
            {
                new: true
            }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to accept messages"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Messages acceptance status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "failed to accept messages"
            },
            {
                status: 501
            }
        )
    }
}
export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            {
                status: 401
            }
        )
    }
    const userId = user._id;
    try {
        const founduser = await UserModel.findById(
            userId
        )
        if (!founduser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessage: founduser.isAcceptingMessage
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.log("failed to updated user status to accept message")
        return Response.json(
            {
                success: false,
                message: "error is getting message acceptance status"

            },
            {
                status: 500
            }
        )
    }

}