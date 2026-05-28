import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class GrpcServer {
    grpcService;
    server;
    port;
    constructor(grpcService, port = 50051) {
        this.grpcService = grpcService;
        this.server = new grpc.Server();
        this.port = port;
        this.setupServices();
    }
    setupServices() {
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
    start() {
        this.server.bindAsync(`0.0.0.0:${this.port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
            if (err) {
                console.error(`[gRPC M2 Server] Fallo al vincular puerto:`, err);
                return;
            }
            console.log(`[gRPC M2 Server] Servidor gRPC corriendo en 0.0.0.0:${boundPort}`);
        });
    }
    async stop() {
        return new Promise((resolve) => {
            this.server.tryShutdown(() => {
                console.log('[gRPC M2 Server] Servidor gRPC apagado.');
                resolve();
            });
        });
    }
}
