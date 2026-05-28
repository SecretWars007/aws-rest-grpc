import { TransferRequestValidator } from '../../domain/dto/transfer-request.dto.js';
import * as grpc from '@grpc/grpc-js';
export class TransferController {
    processTransferUseCase;
    constructor(processTransferUseCase) {
        this.processTransferUseCase = processTransferUseCase;
    }
    async transfer(req, res) {
        try {
            const body = req.body;
            const validationErrors = TransferRequestValidator.validate(body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    status: 'fail',
                    errors: validationErrors,
                });
                return;
            }
            console.log(`[REST M1] Procesando transferencia REST de ${body.sourcePhoneNumber} a ${body.destinationPhoneNumber}`);
            const result = await this.processTransferUseCase.execute({
                sourcePhoneNumber: body.sourcePhoneNumber,
                destinationPhoneNumber: body.destinationPhoneNumber,
                amount: body.amount,
                description: body.description,
            });
            res.status(200).json({
                status: 'success',
                data: {
                    transactionId: result.transactionId,
                    source: {
                        phoneNumber: body.sourcePhoneNumber,
                        owner: result.sourceOwner,
                    },
                    destination: {
                        phoneNumber: body.destinationPhoneNumber,
                        owner: result.destinationOwner,
                    },
                    amount: result.amount,
                    description: body.description || '',
                    message: result.message,
                    timestamp: result.timestamp,
                },
            });
        }
        catch (error) {
            console.error('[REST Controller Error]', error);
            if (error && typeof error.code === 'number') {
                if (error.code === grpc.status.INVALID_ARGUMENT) {
                    res.status(400).json({
                        status: 'fail',
                        message: error.details || 'Argumentos inválidos o error en reglas de negocio',
                    });
                    return;
                }
                if (error.code === grpc.status.UNAVAILABLE) {
                    res.status(503).json({
                        status: 'error',
                        message: 'El servicio central de transacciones (M2) no está disponible en este momento',
                    });
                    return;
                }
            }
            res.status(500).json({
                status: 'error',
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
}
