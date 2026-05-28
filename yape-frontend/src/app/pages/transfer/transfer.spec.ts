import { runInInjectionContext, Injector } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { TransferComponent } from './transfer';
import { TransferService } from '../../services/transfer.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('TransferComponent', () => {
  let component: TransferComponent;
  let mockTransferService: any;

  beforeEach(() => {
    mockTransferService = {
      sourcePhone: vi.fn().mockReturnValue('987654321'),
      sourceName: vi.fn().mockReturnValue('Juan Pérez'),
      currentBalance: vi.fn().mockReturnValue(150.00),
      transactions: vi.fn().mockReturnValue([]),
      transfer: vi.fn()
    };

    const mockRouter = {};
    const mockActivatedRoute = {};

    const injector = Injector.create({
      providers: [
        FormBuilder,
        { provide: TransferService, useValue: mockTransferService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TransferComponent, useClass: TransferComponent }
      ]
    });

    runInInjectionContext(injector, () => {
      component = injector.get(TransferComponent);
    });

    component.ngOnInit(); // Initialize form
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component['transferForm'];
    expect(form.get('sourcePhone')?.value).toBe('987654321');
    expect(form.get('destinationPhone')?.value).toBe('');
    expect(form.get('amount')?.value).toBe(50.00);
    expect(form.get('description')?.value).toBe('Pago de almuerzo');
  });

  it('should validate destination phone number (Peruvian format)', () => {
    const phoneControl = component['transferForm'].get('destinationPhone');
    
    phoneControl?.setValue('');
    expect(phoneControl?.valid).toBe(false); // required

    phoneControl?.setValue('123456789'); // doesn't start with 9
    expect(phoneControl?.valid).toBe(false);

    phoneControl?.setValue('98765432'); // too short (8 digits)
    expect(phoneControl?.valid).toBe(false);

    phoneControl?.setValue('9876543210'); // too long (10 digits)
    expect(phoneControl?.valid).toBe(false);

    phoneControl?.setValue('987654321'); // valid
    expect(phoneControl?.valid).toBe(true);
  });

  it('should validate amount is positive and within balance limits', () => {
    const amountControl = component['transferForm'].get('amount');

    amountControl?.setValue(0);
    expect(amountControl?.valid).toBe(false); // min 0.01

    amountControl?.setValue(-10);
    expect(amountControl?.valid).toBe(false);

    amountControl?.setValue(100);
    expect(amountControl?.valid).toBe(true); // within balance (150)

    amountControl?.setValue(200);
    expect(amountControl?.valid).toBe(false); // exceeds balance (150)
    expect(amountControl?.errors?.['insufficientFunds']).toBe(true);
  });

  it('should select contact from quick options', () => {
    component['selectContact']('999888777');
    expect(component['transferForm'].get('destinationPhone')?.value).toBe('999888777');
  });

  it('should not call transfer if form is invalid', () => {
    component['transferForm'].patchValue({ destinationPhone: '123' }); // invalid
    component['onYapear']();
    expect(mockTransferService.transfer).not.toHaveBeenCalled();
  });

  it('should prevent self-transfer and set error message', () => {
    component['transferForm'].patchValue({
      destinationPhone: '987654321', // same as sourcePhone
      amount: 10
    });

    component['onYapear']();

    expect(component['errorMessage']()).toBe('No puedes yapearte a ti mismo.');
    expect(mockTransferService.transfer).not.toHaveBeenCalled();
  });

  it('should perform transfer successfully and reset form', () => {
    component['transferForm'].patchValue({
      destinationPhone: '912345678',
      amount: 30,
      description: 'Regalo'
    });

    const mockResponse = {
      status: 'success',
      data: {
        transactionId: 'TX-1111',
        amount: 30,
        source: { phoneNumber: '987654321' },
        destination: { phoneNumber: '912345678' }
      }
    };

    mockTransferService.transfer.mockReturnValue(of(mockResponse));

    component['onYapear']();

    expect(mockTransferService.transfer).toHaveBeenCalledWith({
      sourcePhoneNumber: '987654321',
      destinationPhoneNumber: '912345678',
      amount: 30,
      description: 'Regalo'
    });
    expect(component['successData']()).toEqual(mockResponse.data);
    expect(component['errorMessage']()).toBeNull();
  });

  it('should handle transfer failure gracefully', () => {
    component['transferForm'].patchValue({
      destinationPhone: '912345678',
      amount: 30
    });

    mockTransferService.transfer.mockReturnValue(throwError(() => ({
      error: { message: 'El número de destino no existe' }
    })));

    component['onYapear']();

    expect(component['errorMessage']()).toBe('El número de destino no existe');
    expect(component['successData']()).toBeNull();
  });
});
