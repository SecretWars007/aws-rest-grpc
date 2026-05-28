import { Wallet } from '../../domain/entities/wallet.entity.js';
export class InMemoryWalletRepository {
    wallets = new Map();
    transactions = [];
    constructor() {
        this.seedData();
    }
    seedData() {
        // 1. Juan Pérez (987654321): Saldo inicial S/. 150.00
        this.wallets.set('987654321', new Wallet('w-1', '987654321', 'Juan Perez', 150.00));
        // 2. María Rodríguez (912345678): Saldo inicial S/. 10.00
        this.wallets.set('912345678', new Wallet('w-2', '912345678', 'Maria Rodriguez', 10.00));
        // 3. Carlos Mendoza (999888777): Saldo inicial S/. 500.00
        this.wallets.set('999888777', new Wallet('w-3', '999888777', 'Carlos Mendoza', 500.00));
    }
    async findByPhoneNumber(phoneNumber) {
        const wallet = this.wallets.get(phoneNumber);
        if (!wallet)
            return null;
        return wallet;
    }
    async update(wallet) {
        this.wallets.set(wallet.phoneNumber, wallet);
    }
    async saveTransaction(transaction) {
        this.transactions.push(transaction);
        console.log(`[Database] Transacción registrada: ${transaction.id} | De: ${transaction.sourcePhoneNumber} A: ${transaction.destinationPhoneNumber} | Monto: S/. ${transaction.amount}`);
    }
}
