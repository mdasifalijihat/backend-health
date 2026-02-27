import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { superAdminService } from "./superAdmin.service";
import { tokenUtils } from "../../utils/token";


// create super admin
const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.createSuperAdmin(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Super Admin created successfully",
    data: result,
  });
});

// supper admin login 
const superAdminLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await superAdminService.superAdminLogin(email, password);

  const { accessToken, refreshToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin logged in successfully",
    data: result,
  });
});

export const superAdminController = {
  createSuperAdmin,
  superAdminLogin,
};
