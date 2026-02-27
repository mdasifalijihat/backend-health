import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AdminService } from "./admin.service";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createAdmin(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

// admin login
const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AdminService.adminLogin(email, password);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin logged in successfully",
    data: result,
  });
});

// get all admins
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admins retrieved successfully",
    data: result,
  });
});

// update admin
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminService.updateAdmin(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

// delete admin
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminService.deleteAdmin(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  adminLogin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};
