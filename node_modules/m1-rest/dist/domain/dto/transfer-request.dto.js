export class TransferRequestValidator {
    static validate(data) {
        const errors = [];
        const phoneRegex = /^9\d{8}$/;
        if (!data.sourcePhoneNumber || typeof data.sourcePhoneNumber !== 'string') {
            errors.push('sourcePhoneNumber es requerido y debe ser un texto.');
        }
        else if (!phoneRegex.test(data.sourcePhoneNumber)) {
            errors.push('sourcePhoneNumber debe ser un número de celular peruano válido (9 dígitos, empieza con 9).');
        }
        if (!data.destinationPhoneNumber || typeof data.destinationPhoneNumber !== 'string') {
            errors.push('destinationPhoneNumber es requerido y debe ser un texto.');
        }
        else if (!phoneRegex.test(data.destinationPhoneNumber)) {
            errors.push('destinationPhoneNumber debe ser un número de celular peruano válido (9 dígitos, empieza con 9).');
        }
        if (data.sourcePhoneNumber && data.destinationPhoneNumber && data.sourcePhoneNumber === data.destinationPhoneNumber) {
            errors.push('El celular de origen y destino no pueden ser iguales.');
        }
        if (data.amount === undefined || data.amount === null || typeof data.amount !== 'number') {
            errors.push('amount es requerido y debe ser un número.');
        }
        else if (data.amount <= 0) {
            errors.push('amount debe ser un monto mayor a cero.');
        }
        return errors;
    }
}
