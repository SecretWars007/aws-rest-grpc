import { WalletGrpcClient } from './infrastructure/grpc-client/wallet-grpc.client.js';
import { ProcessTransferUseCase } from './use-cases/process-transfer.use-case.js';
import { TransferController } from './infrastructure/controllers/transfer.controller.js';
import { ExpressApp } from './infrastructure/webserver/express.app.js';
const GRPC_HOST = process.env.GRPC_HOST || 'localhost';
const GRPC_PORT = Number(process.env.GRPC_PORT) || 50051;
const HTTP_PORT = Number(process.env.PORT) || 3000;
console.log(`[REST M1] Conectando al servicio gRPC en ${GRPC_HOST}:${GRPC_PORT}`);
const grpcClient = new WalletGrpcClient(GRPC_HOST, GRPC_PORT);
const processTransferUseCase = new ProcessTransferUseCase(grpcClient);
const transferController = new TransferController(processTransferUseCase);
const server = new ExpressApp(transferController, HTTP_PORT);
const serverInstance = server.start();
process.on('SIGTERM', () => {
    console.log('Recibido SIGTERM. Cerrando servidor REST...');
    serverInstance.close(() => {
        console.log('[REST M1] Servidor REST apagado.');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('Recibido SIGINT. Cerrando servidor REST...');
    serverInstance.close(() => {
        console.log('[REST M1] Servidor REST apagado.');
        process.exit(0);
    });
});
