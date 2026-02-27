export interface ICreateSuperAdmin {
  password: string;
  superAdmin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}

export interface IResponseData<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}