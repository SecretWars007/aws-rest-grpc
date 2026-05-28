import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class WalletGrpcClient {
    client;
    constructor(host = 'localhost', port = 50051) {
        const PROTO_PATH = path.resolve(__dirname, '../../../../proto/wallet.proto');
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
        const walletProto = grpc.loadPackageDefinition(packageDefinition);
        this.client = new walletProto.wallet.WalletService(`${host}:${port}`, grpc.credentials.createInsecure());
    }
    async transfer(sourcePhone, destinationPhone, amount, description) {
        return new Promise((resolve, reject) => {
            this.client.Transfer({
                source_phone: sourcePhone,
                destination_phone: destinationPhone,
                amount,
                description,
            }, (err, response) => {
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
            });
        });
    }
}
