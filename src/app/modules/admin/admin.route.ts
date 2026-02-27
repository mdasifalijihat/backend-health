import { Router } from "express";
// import { checkAuth } from "../../middleware/checkAuth";
// import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { adminValidation } from "./admin.validation";
import { AdminController } from "./admin.controller";

const router = Router();

router.post(
  "/create-admin",
//   checkAuth(Role.SUPER_ADMIN),
  validateRequest(adminValidation.createAdminZodSchema),
  AdminController.createAdmin,
);

export const AdminRouters = router;
