export interface ISignUpStepFirstValues {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  confirmPassword: string
}

export interface ISignUpStepSecondValues {
  verification_code: string;
  email: string;
  password: string;
}
export interface ISignUpStepThirdValues {
  last_name: string;
  first_name: string;
  city: string;
  postal_code: string;
  address_line_1: string;
}
