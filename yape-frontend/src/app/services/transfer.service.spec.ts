import { runInInjectionContext, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { TransferService } from './transfer.service';
import { TransferRequest, TransferResponse, HealthResponse } from '../models/transfer.model';

describe('TransferService', () => {
  let service: TransferService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = {
      post: vi.fn(),
      get: vi.fn()
    };

    const injector = Injector.create({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
        { provide: TransferService, useClass: TransferService }
      ]
    });

    runInInjectionContext(injector, () => {
      service = injector.get(TransferService);
    });
  });

  it('should initialize with default states', () => {
    expect(service.sourcePhone()).toBe('987654321');
    expect(service.sourceName()).toBe('Juan Pérez');
    expect(service.currentBalance()).toBe(150.00);
    expect(service.transactions().length).toBe(3);
  });

  it('should execute health check', () => {
    const mockHealth: HealthResponse = { status: 'UP', uptime: '100s' };
    mockHttp.get.mockReturnValue(of(mockHealth));

    service.healthCheck().subscribe(res => {
      expect(res).toEqual(mockHealth);
      expect(mockHttp.get).toHaveBeenCalledWith('http://localhost:3001/health');
    });
  });

  it('should perform transfer and update states when successful (user is source)', () => {
    const mockRequest: TransferRequest = {
      sourcePhoneNumber: '987654321',
      destinationPhoneNumber: '912345678',
      amount: 30.00,
      description: 'Test'
    };

    const mockResponse: TransferResponse = {
      status: 'success',
      message: 'Transferencia realizada con éxito',
      data: {
        transactionId: 'TX-1234',
        source: { phoneNumber: '987654321', owner: 'Juan Pérez' },
        destination: { phoneNumber: '912345678', owner: 'María Rodríguez' },
        amount: 30.00,
        description: 'Test',
        message: 'Success',
        timestamp: new Date().toISOString()
      }
    };

    mockHttp.post.mockReturnValue(of(mockResponse));

    service.transfer(mockRequest).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('http://localhost:3001/api/yape/transfer', mockRequest);
      
      // Check signal updates
      expect(service.currentBalance()).toBe(120.00); // 150 - 30
      expect(service.transactions()[0].transactionId).toBe('TX-1234');
    });
  });

  it('should perform transfer and update states when successful (user is destination)', () => {
    const mockRequest: TransferRequest = {
      sourcePhoneNumber: '912345678',
      destinationPhoneNumber: '987654321',
      amount: 40.00,
      description: 'Incoming'
    };

    const mockResponse: TransferResponse = {
      status: 'success',
      message: 'Transferencia realizada con éxito',
      data: {
        transactionId: 'TX-5678',
        source: { phoneNumber: '912345678', owner: 'María Rodríguez' },
        destination: { phoneNumber: '987654321', owner: 'Juan Pérez' },
        amount: 40.00,
        description: 'Incoming',
        message: 'Success',
        timestamp: new Date().toISOString()
      }
    };

    mockHttp.post.mockReturnValue(of(mockResponse));

    service.transfer(mockRequest).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(service.currentBalance()).toBe(190.00); // 150 + 40
      expect(service.transactions()[0].transactionId).toBe('TX-5678');
    });
  });
});
