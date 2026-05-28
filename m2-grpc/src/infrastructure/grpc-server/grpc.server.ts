import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { WalletGrpcService } from './wallet-grpc.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class GrpcServer {
  private server: grpc.Server;
  private port: number;

  constructor(private readonly grpcService: WalletGrpcService, port: number = 50051) {
    this.server = new grpc.Server();
    this.port = port;
    this.setupServices();
  }

  private setupServices(): void {
    const PROTO_PATH = path.resolve(__dirname, '../../../../proto/wallet.proto');
    
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    
    const walletProto = grpc.loadPackageDefinition(packageDefinition);
    
    const serviceDef = this.grpcService.getServiceDefinition(walletProto);
    this.server.addService(serviceDef.service, serviceDef.implementation);
  }

  start(): void {
    this.server.bindAsync(
      `0.0.0.0:${this.port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, boundPort) => {
        if (err) {
          console.error(`[gRPC M2 Server] Fallo al vincular puerto:`, err);
          return;
        }
        console.log(`[gRPC M2 Server] Servidor gRPC corriendo en 0.0.0.0:${boundPort}`);
      }
    );
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.tryShutdown(() => {
        console.log('[gRPC M2 Server] Servidor gRPC apagado.');
        resolve();
      });
    });
  }
}
