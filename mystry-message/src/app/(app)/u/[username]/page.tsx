'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Apiresponse } from '@/types/ApiResponse';

// Define the schema for form validation using Zod
const contentSchema = z.object({
    content: z.string().min(1, 'Content is required')
});
const Page = () => {
    const { username } = useParams<{ username: string }>();
    const form = useForm<z.infer<typeof contentSchema>>({
        resolver: zodResolver(contentSchema),
    });
    const onSubmit = async (data: { content: string }) => {
        try {
            console.log("Content:", data.content);
            console.log("Username:", username);

            const response = await axios.post<Apiresponse>('/api/send-messages', {
                username,
                content: data.content,
            });

            console.log('Content sent successfully:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-800">
            <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6">Public Profile Link</h1>
                <h2 className="text-xl text-center mb-4">Send Anonymous Message to @{username}</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="content"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <Textarea
                                        {...field}
                                        placeholder="Write your anonymous message here"
                                        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                            Send It
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Page;
