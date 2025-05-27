export class Transaction {}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const TransactionTypeArray = Object.values(TransactionType);
export const TransactionStatusArray = Object.values(TransactionStatus);
