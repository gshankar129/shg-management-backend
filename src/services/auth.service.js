import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";

// Step 1 Registration Service
export async function registerUser(userData){
    const {name, email, phone, password } = userData;

    //check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (existingUser){
        throw new Error("Email already exists")
    }

    // Check if phone already exists
    const existingUserPh = await prisma.user.findUnique({
        where: {
            phone
        }
    });



    if (existingUserPh) {
        throw new Error("Phone number is already registered");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password,10);

    //Create user

    const user = await prisma.user.create({
        data:{
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'GUEST', // Default step 1 role
        },
    });

    return user;
}
    
export async function loginUser(loginData) {
    const { email, password } = loginData;

    // Find user
    const user = await prisma.user.findUnique({
        where: {
        email,
        },
    });

    // Don't reveal whether email exists
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check account status
    if (!user.isActive) {
        throw new Error("Account is inactive");
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = generateToken(user);

    return {
        user,
        token,
    };
    
}