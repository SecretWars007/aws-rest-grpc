import { InMemoryWalletRepository } from './infrastructure/repositories/in-memory-wallet.repository.js';
import { TransferFundsUseCase } from './use-cases/transfer-funds.use-case.js';
import { WalletGrpcService } from './infrastructure/grpc-server/wallet-grpc.service.js';
import { GrpcServer } from './infrastructure/grpc-server/grpc.server.js';

// Inyección de dependencias (DIP en SOLID)
const walletRepository = new InMemoryWalletRepository();
const transferUseCase = new TransferFundsUseCase(walletRepository);
const walletGrpcService = new WalletGrpcService(transferUseCase);

const PORT = Number(process.env.PORT) || 50051;
const server = new GrpcServer(walletGrpcService, PORT);

server.start();

// Manejo de apagado limpio
process.on('SIGTERM', async () => {
  console.log('Recibido SIGTERM. Apagando servidor...');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Recibido SIGINT. Apagando servidor...');
  await server.stop();
  process.exit(0);
});
