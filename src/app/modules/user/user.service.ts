import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  ICreateAdmin,
  ICreateDoctorPayload,
  ICreateSuperAdmin,
} from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (!specialty) {
      throw new Error(`Specialty with ID ${specialtyId} not found`);
    }
    specialties.push(specialty);
  }

  const userExists = await prisma.user.findUnique({
    where: { email: payload.doctor.email },
  });
  if (userExists) {
    throw new Error("User with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });
      const doctorSpecialtiesData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtiesData,
      });

      const doctor = await tx.doctor.findUnique({
        where: { id: doctorData.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transaction failed, rolling back changes :", error);
    await prisma.user.delete({ where: { id: userData.user.id } });
    throw Error;
  }
};

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
          ...payload.admin,
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
          ...payload.superAdmin,
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

export const UserService = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
