export interface ICreateAdmin {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}

export interface IUpdateAdmin {
  name?: string;
  contactNumber?: string;
  profilePhoto?: string;
}