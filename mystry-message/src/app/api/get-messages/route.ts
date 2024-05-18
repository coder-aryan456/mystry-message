import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/db.connect";
import UserModel from "@/model/User";
 import {User }from "next-auth"
import mongoose from "mongoose";
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
  
    if (!session || !_user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
      const user = await UserModel.aggregate([
        { $match: { _id: userId } },
        { $unwind: '$messages' }, // because mesage is array it is used to open the arryay to form multiple objects
        { $sort: { 'messages.createdAt': -1 } },
        { $group: { _id: '$_id', messages: { $push: '$messages' } } },// it is used to form the group of multiple object into one by their id because id is same one object will be created
      ]).exec();
  
      if (!user || user.length === 0) {
        return Response.json(
          { message: 'User not found', success: false },
          { status: 404 }
        );
      }
  
      return Response.json(
        { messages: user[0].messages },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
      );
    }
  }