import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await specialtyService.createSpecialty(payload);

    res.status(201).json({
      success: true,
      message: "specialty create success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const result = await specialtyService.getAllSpecialty();

    res.status(201).json({
      success: true,
      message: "specialty get success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
const deleteSpecialties = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await specialtyService.deleteSpecialties(id as string);

    res.status(201).json({
      success: true,
      message: "specialty Delete success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
const updateSpecialties = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const result = await specialtyService.updateSpecialties(
      id as string,
      payload,
    );

    res.status(200).json({
      success: true,
      message: "specialty Update success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialties,
  updateSpecialties,
};
