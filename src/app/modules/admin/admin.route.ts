import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { adminValidation } from "./admin.validation";
import { AdminController } from "./admin.controller";

const router = Router();

// create admin
router.post(
  "/create-admin",
//   checkAuth(Role.SUPER_ADMIN),
  validateRequest(adminValidation.createAdminZodSchema),
  AdminController.createAdmin,
);

// admin login
router.post(
  "/login",
  validateRequest(adminValidation.loginAdminZodSchema),
  AdminController.adminLogin,
);

// get all admins
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN), 
  AdminController.getAllAdmins,
);

router.patch(
  "/:id",
  // checkAuth(Role.SUPER_ADMIN),
  validateRequest(adminValidation.updateAdminZodSchema),
  AdminController.updateAdmin,
);

router.delete("/:id",
  //  checkAuth(Role.SUPER_ADMIN),
    AdminController.deleteAdmin);

export const AdminRouters = router;
