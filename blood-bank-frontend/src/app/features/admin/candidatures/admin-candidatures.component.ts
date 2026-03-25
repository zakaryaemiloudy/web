import { Component, OnInit, signal, computed, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { CandidatureResponse, StatutCandidature } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-candidatures',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-candidatures.component.html',
})
export class AdminCandidaturesComponent implements OnInit {
  @Input() demandeId!: number;
  
  candidatures = signal<CandidatureResponse[]>([]);
  loading = signal(true);
  processingId = signal<number | null>(null);

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    if (!this.demandeId) return;
    
    this.adminApi.getCandidaturesByDemande(this.demandeId).subscribe({
      next: (list) => this.candidatures.set(list),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  pendingCandidatures = computed(() => 
    this.candidatures().filter(c => c.statut === 'EN_ATTENTE')
  );

  acceptedCandidatures = computed(() => 
    this.candidatures().filter(c => c.statut === 'ACCEPTEE')
  );

  rejectedCandidatures = computed(() => 
    this.candidatures().filter(c => c.statut === 'REJETEE')
  );

  traiter(candidatureId: number, statut: StatutCandidature): void {
    this.processingId.set(candidatureId);
    
    this.adminApi.traiterCandidature(candidatureId, statut).subscribe({
      next: (updated) => {
        this.candidatures.update((list) =>
          list.map((c) => (c.id === updated.id ? updated : c))
        );
        this.processingId.set(null);
      },
      error: () => {
        this.processingId.set(null);
        alert('Erreur lors du traitement de la candidature');
      },
    });
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTEE': return 'bg-green-100 text-green-700';
      case 'REJETEE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'ACCEPTEE': return 'Acceptée';
      case 'REJETEE': return 'Rejetée';
      default: return statut;
    }
  }
}
