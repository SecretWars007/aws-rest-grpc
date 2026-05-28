export class Wallet {
  constructor(
    public readonly id: string,
    public readonly phoneNumber: string,
    public readonly ownerName: string,
    private _balance: number,
    public readonly createdAt: Date = new Date()
  ) {}

  get balance(): number {
    return this._balance;
  }

  hasSufficientFunds(amount: number): boolean {
    return this._balance >= amount;
  }

  debit(amount: number): void {
    if (amount <= 0) {
      throw new Error('El monto a debitar debe ser mayor que cero');
    }
    if (!this.hasSufficientFunds(amount)) {
      throw new Error('Fondos insuficientes');
    }
    this._balance -= amount;
  }

  credit(amount: number): void {
    if (amount <= 0) {
      throw new Error('El monto a acreditar debe ser mayor que cero');
    }
    this._balance += amount;
  }
}
