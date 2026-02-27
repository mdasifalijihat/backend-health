import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateAdmin, IUpdateAdmin } from "./admin.interface";
import { auth } from "../../lib/auth";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { tokenUtils } from "../../utils/token";

// create admin
const createAdmin = async (payload: ICreateAdmin) => {
  const userExist = await prisma.user.findUnique({
    where: { email: payload.admin.email },
  });
  if (userExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "User with this email already exists",
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const adminData = await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.admin.name,
          contactNumber: payload.admin.contactNumber,
          profilePhoto: payload.admin.profilePhoto,
        },
      });
      return adminData;
    });
    return result;
  } catch (error) {
    console.log("Transaction failed, rolling back changes :", error);
    await prisma.user.delete({ where: { id: userData.user.id } });
    throw Error;
  }
};

// login admin 
const adminLogin = async (email: string, password: string) => {
  const data = await auth.api.signInEmail({
    body: { email, password },
  });

  if (!data?.user || data.user.role !== Role.ADMIN) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
  });

  return { accessToken, refreshToken };
};


// update admin
const updateAdmin = async (adminId: string, payload: IUpdateAdmin) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin || admin.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const result = await prisma.admin.update({
    where: { id: adminId },
    data: payload,
  });

  return result;
};

// delete admin
const deleteAdmin = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin || admin.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const result = await prisma.admin.update({
    where: { id: adminId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return result;
};

export const AdminService = {
  createAdmin,
  adminLogin,
  updateAdmin,
  deleteAdmin,
};
