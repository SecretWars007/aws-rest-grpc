import * as grpc from '@grpc/grpc-js';
import { TransferFundsUseCase } from '../../use-cases/transfer-funds.use-case.js';
import { DomainException } from '../../domain/exceptions/domain.exception.js';

export class WalletGrpcService {
  constructor(private readonly transferUseCase: TransferFundsUseCase) {}

  getServiceDefinition(walletProto: any) {
    return {
      service: walletProto.wallet.WalletService.service,
      implementation: {
        Transfer: this.transfer.bind(this),
      },
    };
  }

  async transfer(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { source_phone, destination_phone, amount, description } = call.request;

      console.log(`[gRPC M2] Recibida solicitud de transferencia de ${source_phone} a ${destination_phone} por S/. ${amount}`);

      const result = await this.transferUseCase.execute({
        sourcePhone: source_phone,
        destinationPhone: destination_phone,
        amount: Number(amount),
        description: description || '',
      });

      callback(null, {
        success: true,
        transaction_id: result.transactionId,
        message: result.message,
        timestamp: result.timestamp.toISOString(),
        amount: result.amount,
        source_owner: result.sourceOwner,
        destination_owner: result.destinationOwner,
      });
    } catch (error) {
      console.error('[gRPC M2 Error]', error);
      if (error instanceof DomainException) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          details: error instanceof Error ? error.message : 'Error interno en M2',
        });
      }
    }
  }
}
