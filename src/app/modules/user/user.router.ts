import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import {
  createAdminZodSchema,
  createDoctorZodSchema,
  createSupperAdminZodSchema,
} from "./user.validation";
import { UserController } from "./user.controller";

const router = Router();

router.post(
  "/create-doctor",
  validateRequest(createDoctorZodSchema),
  UserController.createDoctor,
);

router.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  UserController.createAdmin,
);

router.post(
  "/create-super-admin",
  validateRequest(createSupperAdminZodSchema),
  UserController.createSuperAdmin,
);

console.log("User router loaded successfully");

export const UserRouters = router;
