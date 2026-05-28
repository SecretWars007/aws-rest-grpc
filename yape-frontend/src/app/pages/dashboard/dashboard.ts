import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TransferService } from '../../services/transfer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {
  protected readonly service = inject(TransferService);
  
  // Local UI state
  protected readonly currentDate = signal<Date>(new Date());
  protected readonly isApiHealthy = signal<boolean>(false);
  protected readonly isCheckingHealth = signal<boolean>(true);

  ngOnInit() {
    this.checkBackendHealth();
  }

  private checkBackendHealth() {
    this.isCheckingHealth.set(true);
    this.service.healthCheck().subscribe({
      next: (res) => {
        this.isApiHealthy.set(res.status === 'UP' || res.status === 'success' || !!res.uptime);
        this.isCheckingHealth.set(false);
      },
      error: () => {
        this.isApiHealthy.set(false);
        this.isCheckingHealth.set(false);
      }
    });
  }

  // Quick refresh button
  protected refreshHealth() {
    this.checkBackendHealth();
  }
}
