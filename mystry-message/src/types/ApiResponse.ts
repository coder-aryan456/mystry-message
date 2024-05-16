import { Message } from "@/model/User";
export interface Apiresponse{
    success:boolean;
    message:string;
    isAccesptingMessage?:boolean
    messages?:Array<Message>
}