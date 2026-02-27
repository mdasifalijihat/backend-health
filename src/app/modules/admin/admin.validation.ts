import z from "zod";

// admin create validation
const createAdminZodSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),
  admin: z.object({
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

// login validation
const loginAdminZodSchema = z.object({
  email: z.string("Email is required").email("Invalid email format"),
  password: z.string("Password is required").min(1, "Password is required"),
});

// update validation
const updateAdminZodSchema = z.object({
  name: z.string("Name is required").optional(),
  contactNumber: z.string("Contact number is required").optional(),
  profilePhoto: z.string("Profile photo is required").optional(),
});


export const adminValidation = {
  createAdminZodSchema,
  loginAdminZodSchema,
  updateAdminZodSchema,
};
