import express, { Express } from 'express';
import cors from 'cors';
import { TransferController } from '../controllers/transfer.controller.js';

export class ExpressApp {
  private app: Express;
  private port: number;

  constructor(private readonly transferController: TransferController, port: number = 3000) {
    this.app = express();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'UP', service: 'm1-rest' });
    });

    this.app.post('/api/yape/transfer', (req, res) => {
      this.transferController.transfer(req, res);
    });
  }

  start(): any {
    return this.app.listen(this.port, () => {
      console.log(`[REST M1 Server] HTTP API corriendo en http://localhost:${this.port}`);
    });
  }
}
