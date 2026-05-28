export class Transaction {
    id;
    sourcePhoneNumber;
    destinationPhoneNumber;
    amount;
    description;
    status;
    message;
    timestamp;
    constructor(id, sourcePhoneNumber, destinationPhoneNumber, amount, description, status, message, timestamp = new Date()) {
        this.id = id;
        this.sourcePhoneNumber = sourcePhoneNumber;
        this.destinationPhoneNumber = destinationPhoneNumber;
        this.amount = amount;
        this.description = description;
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }
}
