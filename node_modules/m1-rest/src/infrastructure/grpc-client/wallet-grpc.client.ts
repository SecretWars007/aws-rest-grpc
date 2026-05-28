import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface GrpcTransferResponse {
  success: boolean;
  transactionId: string;
  message: string;
  timestamp: string;
  amount: number;
  sourceOwner: string;
  destinationOwner: string;
}

export class WalletGrpcClient {
  private client: any;

  constructor(host: string = 'localhost', port: number = 50051) {
    const PROTO_PATH = path.resolve(__dirname, '../../../../proto/wallet.proto');
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const walletProto = grpc.loadPackageDefinition(packageDefinition) as any;
    
    this.client = new walletProto.wallet.WalletService(
      `${host}:${port}`,
      grpc.credentials.createInsecure()
    );
  }

  async transfer(
    sourcePhone: string,
    destinationPhone: string,
    amount: number,
    description: string
  ): Promise<GrpcTransferResponse> {
    return new Promise((resolve, reject) => {
      this.client.Transfer(
        {
          source_phone: sourcePhone,
          destination_phone: destinationPhone,
          amount,
          description,
        },
        (err: grpc.ServiceError | null, response: any) => {
          if (err) {
            return reject(err);
          }
          resolve({
            success: response.success,
            transactionId: response.transaction_id,
            message: response.message,
            timestamp: response.timestamp,
            amount: response.amount,
            sourceOwner: response.source_owner,
            destinationOwner: response.destination_owner,
          });
        }
      );
    });
  }
}
