export class ProcessTransferUseCase {
    grpcClient;
    constructor(grpcClient) {
        this.grpcClient = grpcClient;
    }
    async execute(input) {
        const { sourcePhoneNumber, destinationPhoneNumber, amount, description = '' } = input;
        return this.grpcClient.transfer(sourcePhoneNumber, destinationPhoneNumber, amount, description);
    }
}
