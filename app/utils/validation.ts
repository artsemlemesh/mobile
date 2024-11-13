import * as yup from 'yup';

const passwordRegExp = new RegExp(
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
);

export const signInValidationSchema = yup.object().shape({
  email: yup.string().email().required('*'),
  password: yup.string().required('*'),
});

export const signUpFirstValidationSchema = yup.object().shape({
  first_name: yup.string().required('*'),
  last_name: yup.string().required('*'),
  email: yup.string().email().required('Email please'),
  password: yup
    .string()
    .min(6)
    .matches(
      passwordRegExp,
      'One uppercase, one small, one symbol and one number at least'
    )
    .required('Password please'),
  confirmPassword: yup
    .string()
    .required()
    .label('Confirm password')
    .test('passwords-match', 'Passwords must match', function(value) {
      return this.parent.password === value;
    }),
});

export const signUpSecondValidationSchema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  city: yup.string().required('City is required'),
  postal_code: yup.string().required('Zip is required'),
  address_line_1: yup.string().required('Address is required'),
});

export const confirmationAccountValidationSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  code: yup.string().required(),
});

export const forgotPasswordValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export const changePasswordByCodeValidationSchema = yup.object().shape({
  code: yup.string().required(),
  password: yup
    .string()
    .min(6)
    .matches(
      passwordRegExp,
      'One uppercase, one small, one symbol and one number at least'
    )
    .required(),
});

export const listingFlowInformationValidationSchema = yup.object().shape({
  title: yup.string().required(),
  // tags: yup
  //   .array()
  //   .min(1)
  //   .required(),
  description: yup.string().required(),
});

export const addressValidationSchema = yup.object().shape({
  address_line_1: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postal_code: yup.string().required('Zip is required'),
});