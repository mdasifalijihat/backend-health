import { Router } from "express";
import { SpecialtyRouter } from "../modules/specialty/specialty.router";
import { AuthRouters } from "../modules/auth/auth.router";


const router = Router();
router.use("/", AuthRouters);
router.use("/specialties", SpecialtyRouter);

export const IndexRoutes = router;
