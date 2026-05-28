import { IWalletRepository } from '../domain/repositories/wallet.repository.interface.js';
import { Transaction } from '../domain/entities/transaction.entity.js';
import { DomainException } from '../domain/exceptions/domain.exception.js';
import crypto from 'crypto';

export interface TransferInput {
  sourcePhone: string;
  destinationPhone: string;
  amount: number;
  description: string;
}

export interface TransferOutput {
  success: boolean;
  transactionId: string;
  message: string;
  timestamp: Date;
  amount: number;
  sourceOwner: string;
  destinationOwner: string;
}

export class TransferFundsUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(input: TransferInput): Promise<TransferOutput> {
    const { sourcePhone, destinationPhone, amount, description } = input;

    if (sourcePhone === destinationPhone) {
      throw new DomainException('No se puede realizar una transferencia al mismo número de celular.');
    }

    if (amount <= 0) {
      throw new DomainException('El monto de la transferencia debe ser mayor a cero.');
    }

    // 1. Obtener billetera de origen
    const sourceWallet = await this.walletRepository.findByPhoneNumber(sourcePhone);
    if (!sourceWallet) {
      throw new DomainException(`La billetera de origen con celular ${sourcePhone} no existe.`);
    }

    // 2. Obtener billetera de destino
    const destinationWallet = await this.walletRepository.findByPhoneNumber(destinationPhone);
    if (!destinationWallet) {
      throw new DomainException(`La billetera de destino con celular ${destinationPhone} no existe.`);
    }

    // 3. Validar fondos suficientes
    if (!sourceWallet.hasSufficientFunds(amount)) {
      throw new DomainException('Saldo insuficiente para realizar la transferencia.');
    }

    // 4. Realizar la transferencia (débito y crédito)
    sourceWallet.debit(amount);
    destinationWallet.credit(amount);

    // 5. Guardar los estados actualizados en el repositorio
    await this.walletRepository.update(sourceWallet);
    await this.walletRepository.update(destinationWallet);

    // 6. Generar registro de transacción
    const transactionId = `tx-${crypto.randomUUID()}`;
    const transaction = new Transaction(
      transactionId,
      sourcePhone,
      destinationPhone,
      amount,
      description,
      'SUCCESS',
      'Transferencia realizada con éxito'
    );

    await this.walletRepository.saveTransaction(transaction);

    return {
      success: true,
      transactionId: transaction.id,
      message: transaction.message,
      timestamp: transaction.timestamp,
      amount: transaction.amount,
      sourceOwner: sourceWallet.ownerName,
      destinationOwner: destinationWallet.ownerName,
    };
  }
}
