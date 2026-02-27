import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateAdmin } from "./admin.interface";
import { auth } from "../../lib/auth";
import { Role } from "../../../generated/prisma/enums";

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

export const AdminService = {
  createAdmin,
};
