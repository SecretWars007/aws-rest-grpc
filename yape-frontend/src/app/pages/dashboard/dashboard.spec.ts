import { runInInjectionContext, Injector } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { DashboardComponent } from './dashboard';
import { TransferService } from '../../services/transfer.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let mockTransferService: any;

  beforeEach(() => {
    mockTransferService = {
      sourcePhone: vi.fn().mockReturnValue('987654321'),
      sourceName: vi.fn().mockReturnValue('Juan Pérez'),
      currentBalance: vi.fn().mockReturnValue(150.00),
      transactions: vi.fn().mockReturnValue([]),
      healthCheck: vi.fn()
    };

    const mockRouter = {};
    const mockActivatedRoute = {};

    const injector = Injector.create({
      providers: [
        { provide: TransferService, useValue: mockTransferService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DashboardComponent, useClass: DashboardComponent }
      ]
    });

    runInInjectionContext(injector, () => {
      component = injector.get(DashboardComponent);
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check backend health as healthy on init', () => {
    mockTransferService.healthCheck.mockReturnValue(of({ status: 'UP' }));

    component.ngOnInit();

    expect(mockTransferService.healthCheck).toHaveBeenCalled();
    expect(component['isApiHealthy']()).toBe(true);
    expect(component['isCheckingHealth']()).toBe(false);
  });

  it('should check backend health as unhealthy on error', () => {
    mockTransferService.healthCheck.mockReturnValue(throwError(() => new Error('Connection failed')));

    component.ngOnInit();

    expect(mockTransferService.healthCheck).toHaveBeenCalled();
    expect(component['isApiHealthy']()).toBe(false);
    expect(component['isCheckingHealth']()).toBe(false);
  });
});
