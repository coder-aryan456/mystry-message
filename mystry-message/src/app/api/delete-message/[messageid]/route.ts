import { dbConnect } from "@/lib/db.connect"
import { User, getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import UserModel from "@/model/User"
export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageid = params.messageid
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    try {
        const updatedresult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        )

        if (updatedresult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Not updated message"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success:true,
                message:"updated successfully"
            },
            {
                status:200
            }
        )
    } catch (error) {

    }
}