import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DonorApiService } from '../../../core/services/api/donor-api.service';
import type { DemandeSangResponse } from '../../../core/models/types';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';

interface DemandWithCandidacy extends DemandeSangResponse {
  hasApplied?: boolean;
}

@Component({
  selector: 'app-donor-blood-requests',
  standalone: true,
  imports: [CommonModule, DatePipe, BloodTypeBadgeComponent],
  templateUrl: './donor-blood-requests.component.html',
})
export class DonorBloodRequestsComponent implements OnInit {
  requests = signal<DemandWithCandidacy[]>([]);
  myApplications = signal<any[]>([]);
  loading = signal(true);
  applicationsLoading = signal(true);
  activeTab = signal<'available' | 'applied'>('available');
  applyingFor = signal<number | null>(null);

  constructor(private donorApi: DonorApiService) {}

  filteredRequests = computed(() => {
    if (this.activeTab() === 'applied') {
      return this.myApplications();
    }
    return this.requests();
  });

  ngOnInit(): void {
    this.loadAvailableRequests();
    this.loadMyApplications();
  }

  loadAvailableRequests(): void {
    this.donorApi.getDemandesDisponibles().subscribe({
      next: (list) => this.requests.set(list),
      error: () => {
        this.loading.set(false);
        alert('Erreur lors du chargement des demandes');
      },
      complete: () => this.loading.set(false),
    });
  }

  loadMyApplications(): void {
    this.donorApi.getMesCandidatures().subscribe({
      next: (list) => this.myApplications.set(list),
      error: () => {
        this.applicationsLoading.set(false);
      },
      complete: () => this.applicationsLoading.set(false),
    });
  }

  setTab(tab: 'available' | 'applied'): void {
    this.activeTab.set(tab);
  }

  postulDemande(demandeId: number): void {
    this.applyingFor.set(demandeId);
    this.donorApi.postulerDemande(demandeId).subscribe({
      next: (candidature) => {
        this.requests.update((list) =>
          list.filter((r) => r.id !== demandeId)
        );
        this.myApplications.update((list) => [...list, candidature]);
        this.applyingFor.set(null);
        alert('Candidature envoyée avec succès!');
      },
      error: (err) => {
        this.applyingFor.set(null);
        alert(err.error?.message || 'Erreur lors de la candidature');
      },
    });
  }

  urgencyBadgeClass(urgence: string): string {
    if (urgence === 'CRITIQUE') return 'bg-red-100 text-red-800';
    if (urgence === 'HAUTE') return 'bg-orange-100 text-orange-800';
    if (urgence === 'NORMALE') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  }

  urgencyLabel(urgence: string): string {
    const labels: Record<string, string> = {
      'CRITIQUE': 'Critique',
      'HAUTE': 'Urgente',
      'NORMALE': 'Normal',
      'BASSE': 'Non urgent',
    };
    return labels[urgence] || urgence;
  }

  apparitionBadgeClass(statut: string): string {
    if (statut === 'ACCEPTEE') return 'bg-green-100 text-green-800';
    if (statut === 'REJETEE') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  apparitionLabel(statut: string): string {
    const labels: Record<string, string> = {
      'ACCEPTEE': 'Acceptée',
      'REJETEE': 'Rejetée',
      'EN_ATTENTE': 'En attente',
    };
    return labels[statut] || statut;
  }
}
