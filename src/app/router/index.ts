import { Router } from "express";
import { SpecialtyRouter } from "../modules/specialty/specialty.router";
import { AuthRouters } from "../modules/auth/auth.router";
import { UserRouters } from "../modules/user/user.router";
import { superAdminRoutes } from "../modules/superAdmin/superAdmin.route";
import { AdminRouters } from "../modules/admin/admin.route";


const router = Router();

router.use("/", AuthRouters);
router.use("/specialties", SpecialtyRouter);
router.use("/users", UserRouters);
router.use("/super-admin", superAdminRoutes);
router.use("/admin", AdminRouters);

export const IndexRoutes = router;
