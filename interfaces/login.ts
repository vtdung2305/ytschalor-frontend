export interface IFormLogin {
  email: string
  password: string
  role: number | string
}

export interface IFormForgotPassword {
  email: string
}

export interface IFormResetPassword {
  email: string
  password: string
  password_confirmation: string
}
