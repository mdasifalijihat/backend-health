import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { UserService } from "./user.service";


// create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserService.createDoctor(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

// create super admin
const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createSuperAdmin(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Super Admin created successfully",
    data: result,
  });
});

export const UserController = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
