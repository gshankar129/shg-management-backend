import { registerUser ,loginUser} from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";

export async function register(req, res) {
  try {
    // Validate request body
    console.log(req.body);
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const user = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {

    // Zod validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    // Duplicate email
    if (error.message === "Email already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Phone number is already registered") {
            return res.status(409).json({
                success: false,
                message: error.message
            });
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res) {
  try {
    // Validate request
    const validatedData = loginSchema.parse(req.body);

    // Login user
    const { user, token } = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },

        token,
      },
    });

  } catch (error) {

    // Zod validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    // Authentication errors
    if (
      error.message === "Invalid email or password" ||
      error.message === "Account is inactive"
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}