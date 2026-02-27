import { Router } from "express";
import { SpecialtyRouter } from "../modules/specialty/specialty.router";
import { AuthRouters } from "../modules/auth/auth.router";
import { UserRouters } from "../modules/user/user.router";


const router = Router();

router.use("/", AuthRouters);
router.use("/specialties", SpecialtyRouter);
router.use("/users", UserRouters);

export const IndexRoutes = router;
