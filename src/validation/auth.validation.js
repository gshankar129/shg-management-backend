import {z} from "zod";

export const registerSchema = z.object({
    name: z
    .string()
    .min(2, "full name must be at 2 characters")
    .max(100, "Full name is too long"),

    email: z
        .string()
        .email("Invalid email address")
        .transform((value) => value.toLowerCase().trim()),

    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
        .optional(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase().trim()),

  password: z
    .string()
    .min(1, "Password is required"),
});