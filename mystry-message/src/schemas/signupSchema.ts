import { z } from 'zod'

export const usernamevalidation = z.string().min(2, "username must be 2 character at least")
    .max(20, "max character should be less than 20")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain speacial character")

export const signupSchema = z.object({
    username: usernamevalidation,
    email: z.string().email({ message: "invalid email address" }),
    password: z.string().min(6, { message: "password must be atleas of 6 character" })
})
