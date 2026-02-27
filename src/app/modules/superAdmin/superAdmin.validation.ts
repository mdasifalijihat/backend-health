import z from "zod";

const createSupperAdminZodSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),
  superAdmin: z.object({
    name: z

      .string("Name must be required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
    contactNumber: z
      .string("Contact number must be required")
      .min(11, "Contact number must be at least 11 digits")
      .max(14, "Contact number must be at most 14 digits"),
    email: z.email("Invalid email format"),
  }),
});

// 🔹 Login Validation
const superAdminLoginValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const superAdminValidation = {
  createSupperAdminZodSchema,
  superAdminLoginValidation,
};
