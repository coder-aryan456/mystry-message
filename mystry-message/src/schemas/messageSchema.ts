import { z } from 'zod'

export const messageSchema = z.object({
    content: z.string()
        .min(10, { message: "message must be atleast of 10 character" })
        .max(300, { message: "message must not be more than 300 character" })
})