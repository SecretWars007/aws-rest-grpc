import { Wallet } from '../entities/wallet.entity.js';
import { Transaction } from '../entities/transaction.entity.js';

export interface IWalletRepository {
  findByPhoneNumber(phoneNumber: string): Promise<Wallet | null>;
  update(wallet: Wallet): Promise<void>;
  saveTransaction(transaction: Transaction): Promise<void>;
}
