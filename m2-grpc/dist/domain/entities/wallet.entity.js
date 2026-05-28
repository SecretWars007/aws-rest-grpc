export class Wallet {
    id;
    phoneNumber;
    ownerName;
    _balance;
    createdAt;
    constructor(id, phoneNumber, ownerName, _balance, createdAt = new Date()) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.ownerName = ownerName;
        this._balance = _balance;
        this.createdAt = createdAt;
    }
    get balance() {
        return this._balance;
    }
    hasSufficientFunds(amount) {
        return this._balance >= amount;
    }
    debit(amount) {
        if (amount <= 0) {
            throw new Error('El monto a debitar debe ser mayor que cero');
        }
        if (!this.hasSufficientFunds(amount)) {
            throw new Error('Fondos insuficientes');
        }
        this._balance -= amount;
    }
    credit(amount) {
        if (amount <= 0) {
            throw new Error('El monto a acreditar debe ser mayor que cero');
        }
        this._balance += amount;
    }
}
