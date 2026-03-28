export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  name: string;
  photo?: string;
}

export interface User extends Omit<UserRegister, 'password'> {
  id: number;
}
