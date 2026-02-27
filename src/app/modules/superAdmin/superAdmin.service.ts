import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { tokenUtils } from "../../utils/token";
import { ICreateSuperAdmin } from "./superAdmin.interface";
import { prisma } from "../../lib/prisma";

// create super admin
const createSuperAdmin = async (payload: ICreateSuperAdmin) => {
  const userExist = await prisma.user.findUnique({
    where: { email: payload.superAdmin.email },
  });
  if (userExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "User with this email already exists",
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.superAdmin.email,
      password: payload.password,
      role: Role.SUPER_ADMIN,
      name: payload.superAdmin.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const superAdminData = await tx.superAdmin.create({
        data: {
          userId: userData.user.id,
          name: payload.superAdmin.name,
          profilePhoto: payload.superAdmin.profilePhoto,
          contactNumber: payload.superAdmin.contactNumber,
        },
      });
      return superAdminData;
    });
    return result;
  } catch (error) {
    console.log("Transaction failed, rolling back changes :", error);
    await prisma.user.delete({ where: { id: userData.user.id } });
    throw Error;
  }
};

// supper admin login
const superAdminLogin = async (email: string, password: string) => {
  // 1️⃣ Authenticate user
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data?.user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  // 2️⃣ Role check (VERY IMPORTANT)
  if (data.user.role !== Role.SUPER_ADMIN) {
    throw new AppError(status.FORBIDDEN, "Access denied. Not a Super Admin");
  }

  // 3️⃣ Status check
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  // 4️⃣ Generate tokens
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
  });

  return {
    accessToken,
    refreshToken,
  };
};

// get all admin 


export const superAdminService = {
  createSuperAdmin,
  superAdminLogin,
};
