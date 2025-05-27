export class Account {}

export enum AccountType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  JOINT = 'joint',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export const AccountTypeArray = Object.values(AccountType);
