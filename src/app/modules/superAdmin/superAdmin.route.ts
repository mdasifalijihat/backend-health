import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { superAdminValidation } from "./superAdmin.validation";
import { superAdminController } from "./superAdmin.controller";

const router = Router();

router.post(
  "/create-super-admin",
  validateRequest(superAdminValidation.createSupperAdminZodSchema),
  superAdminController.createSuperAdmin,
);


// 🔐 Super Admin Login
router.post(
  "/login",
  validateRequest(superAdminValidation.superAdminLoginValidation),
  superAdminController.superAdminLogin,
);

export const superAdminRoutes = router;
