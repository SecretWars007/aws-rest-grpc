import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { TransferService } from '../../services/transfer.service';
import { TransferData } from '../../models/transfer.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe, DecimalPipe],
  templateUrl: './transfer.html',
  styleUrls: []
})
export class TransferComponent implements OnInit {
  protected readonly service = inject(TransferService);
  private readonly fb = inject(FormBuilder);

  // Forms and State
  protected transferForm!: FormGroup;
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly successData = signal<TransferData | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // Quick contacts options
  protected readonly quickContacts = [
    { name: 'María Rodríguez', phone: '912345678', initials: 'MR', colorClass: 'bg-secondary-container text-on-secondary-container' },
    { name: 'Carlos Mendoza', phone: '999888777', initials: 'CM', colorClass: 'yape-gradient text-on-primary' },
    { name: 'Pedro Ortiz', phone: '987123456', initials: 'PO', colorClass: 'bg-tertiary-container text-on-tertiary-container' }
  ];

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.transferForm = this.fb.group({
      sourcePhone: [{ value: this.service.sourcePhone(), disabled: true }, [Validators.required]],
      destinationPhone: ['', [
        Validators.required, 
        Validators.pattern(/^9\d{8}$/) // Peru cellular format: 9 digits starting with 9
      ]],
      amount: [50.00, [
        Validators.required, 
        Validators.min(0.01),
        // Custom validator for balance check
        (control: AbstractControl) => {
          if (control.value > this.service.currentBalance()) {
            return { insufficientFunds: true };
          }
          return null;
        }
      ]],
      description: ['Pago de almuerzo', [Validators.maxLength(100)]]
    });
  }


  // Quick-select contact
  protected selectContact(phone: string) {
    this.transferForm.patchValue({ destinationPhone: phone });
    this.transferForm.get('destinationPhone')?.markAsDirty();
  }

  // Execute transfer
  protected onYapear() {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successData.set(null);

    const formVal = this.transferForm.getRawValue();
    const req = {
      sourcePhoneNumber: formVal.sourcePhone,
      destinationPhoneNumber: formVal.destinationPhone,
      amount: Number(formVal.amount),
      description: formVal.description || ''
    };

    // Self-transfer check
    if (req.sourcePhoneNumber === req.destinationPhoneNumber) {
      this.errorMessage.set('No puedes yapearte a ti mismo.');
      this.isSubmitting.set(false);
      return;
    }

    this.service.transfer(req).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.status === 'success' && res.data) {
          this.successData.set(res.data);
          this.transferForm.reset({
            sourcePhone: this.service.sourcePhone(),
            destinationPhone: '',
            amount: 50.00,
            description: ''
          });
        } else {
          this.errorMessage.set(res.message || 'Error desconocido al realizar la transferencia.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const errMsg = err.error?.message || err.error?.errors?.join(', ') || 'No se pudo conectar con el microservicio REST (M1). Verifique que esté encendido.';
        this.errorMessage.set(errMsg);
      }
    });
  }

  protected resetTransfer() {
    this.successData.set(null);
    this.errorMessage.set(null);
  }
}
