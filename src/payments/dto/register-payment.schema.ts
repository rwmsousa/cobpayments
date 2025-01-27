import * as Joi from 'joi';

export const registerPaymentSchema = Joi.object({
  name: Joi.string().min(1).max(15).required().messages({
    'string.base': 'Name must be a text',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least {#limit} characters long',
    'string.max': 'Name must be at most {#limit} characters long',
    'any.required': 'Name is required',
  }),
  age: Joi.string().length(4).required().messages({
    'string.base': 'Age must be a text',
    'string.empty': 'Age cannot be empty',
    'string.length': 'Age must be exactly {#limit} characters long',
    'any.required': 'Age is required',
  }),
  address: Joi.string().max(34).required().messages({
    'string.base': 'Address must be a text',
    'string.empty': 'Address cannot be empty',
    'string.max': 'Address must be at most {#limit} characters long',
    'any.required': 'Address is required',
  }),
  cpf: Joi.string().length(11).required().messages({
    'string.base': 'CPF must be a text',
    'string.empty': 'CPF cannot be empty',
    'string.length': 'CPF must be exactly {#limit} characters long',
    'any.required': 'CPF is required',
  }),
  amountPaid: Joi.string().length(16).required().messages({
    'string.base': 'Amount Paid must be a text',
    'string.empty': 'Amount Paid cannot be empty',
    'string.length': 'Amount Paid must be exactly {#limit} characters long',
    'any.required': 'Amount Paid is required',
  }),
  birthDate: Joi.string().length(8).required().messages({
    'string.base': 'Birth Date must be a text',
    'string.empty': 'Birth Date cannot be empty',
    'string.length': 'Birth Date must be exactly {#limit} characters long',
    'any.required': 'Birth Date is required',
  }),
});
