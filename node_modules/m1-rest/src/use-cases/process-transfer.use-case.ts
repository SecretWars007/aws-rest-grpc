import { WalletGrpcClient, GrpcTransferResponse } from '../infrastructure/grpc-client/wallet-grpc.client.js';

export interface ProcessTransferInput {
  sourcePhoneNumber: string;
  destinationPhoneNumber: string;
  amount: number;
  description?: string;
}

export class ProcessTransferUseCase {
  constructor(private readonly grpcClient: WalletGrpcClient) {}

  async execute(input: ProcessTransferInput): Promise<GrpcTransferResponse> {
    const { sourcePhoneNumber, destinationPhoneNumber, amount, description = '' } = input;
    
    return this.grpcClient.transfer(
      sourcePhoneNumber,
      destinationPhoneNumber,
      amount,
      description
    );
  }
}
