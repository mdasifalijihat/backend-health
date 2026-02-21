import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router = Router();

router.post("/", SpecialtyController.createSpecialty);
router.get("/", SpecialtyController.getAllSpecialties);
router.patch("/:id", SpecialtyController.updateSpecialties);
router.delete("/:id", SpecialtyController.deleteSpecialties);

export const SpecialtyRouter = router;
