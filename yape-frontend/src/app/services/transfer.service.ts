import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TransferRequest, TransferResponse, HealthResponse, TransferData } from '../models/transfer.model';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001';

  // Shared state using Angular signals
  readonly sourcePhone = signal('987654321');
  readonly sourceName = signal('Juan Pérez');
  readonly currentBalance = signal(150.00);

  readonly transactions = signal<TransferData[]>([
    {
      transactionId: 'YPE-8947239847',
      source: { phoneNumber: '987654321', owner: 'Juan Pérez' },
      destination: { phoneNumber: '912345678', owner: 'María Rodríguez' },
      amount: 50.00,
      description: 'Pago de almuerzo',
      message: 'Transferencia exitosa de S/. 50.00 a María Rodríguez',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
    },
    {
      transactionId: 'YPE-3847293847',
      source: { phoneNumber: '999888777', owner: 'Carlos Mendoza' },
      destination: { phoneNumber: '987654321', owner: 'Juan Pérez' },
      amount: 25.00,
      description: 'Reembolso taxi',
      message: 'Transferencia exitosa de S/. 25.00 a Juan Pérez',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
    },
    {
      transactionId: 'YPE-1029384756',
      source: { phoneNumber: '987654321', owner: 'Juan Pérez' },
      destination: { phoneNumber: '912345678', owner: 'María Rodríguez' },
      amount: 10.00,
      description: 'Golosinas',
      message: 'Transferencia exitosa de S/. 10.00 a María Rodríguez',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
    }
  ]);

  transfer(request: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.baseUrl}/api/yape/transfer`, request).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          const tx = response.data;
          
          // Add to transactions list
          this.transactions.update(prev => [tx, ...prev]);

          // Update balance dynamically if Juan is source or destination
          if (tx.source.phoneNumber === this.sourcePhone()) {
            this.currentBalance.update(b => b - tx.amount);
          } else if (tx.destination.phoneNumber === this.sourcePhone()) {
            this.currentBalance.update(b => b + tx.amount);
          }
        }
      })
    );
  }

  healthCheck(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }
}

