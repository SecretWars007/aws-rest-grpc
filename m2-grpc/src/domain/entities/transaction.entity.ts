export class Transaction {
  constructor(
    public readonly id: string,
    public readonly sourcePhoneNumber: string,
    public readonly destinationPhoneNumber: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly status: 'SUCCESS' | 'FAILED',
    public readonly message: string,
    public readonly timestamp: Date = new Date()
  ) {}
}
