import express from 'express';
import cors from 'cors';
export class ExpressApp {
    transferController;
    app;
    port;
    constructor(transferController, port = 3000) {
        this.transferController = transferController;
        this.app = express();
        this.port = port;
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }
    setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'UP', service: 'm1-rest' });
        });
        this.app.post('/api/yape/transfer', (req, res) => {
            this.transferController.transfer(req, res);
        });
    }
    start() {
        return this.app.listen(this.port, () => {
            console.log(`[REST M1 Server] HTTP API corriendo en http://localhost:${this.port}`);
        });
    }
}
