import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import type { DemandeSangResponse } from '../../../core/models/types';

@Component({
  selector: 'app-demand-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, BloodTypeBadgeComponent, StatusBadgeComponent],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      @if (loading()) {
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-gray-400 animate-spin">refresh</span>
          <p class="text-gray-500 mt-4">Chargement...</p>
        </div>
      } @else if (demande()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <!-- Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Détail de la demande</h1>
                <p class="text-gray-600 mt-1">
                  Demande de sang pour {{ demande()?.hopitalNom ?? 'Non spécifié' }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <app-status-badge [status]="demande()!.statut || 'EN_ATTENTE'" />
                <button
                  (click)="editDemande()"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Blood Type & Quantity -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Informations de sang</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Groupe sanguin:</span>
                  <app-blood-type-badge [groupeSanguin]="demande()!.groupeSanguinDemande" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Quantité demandée:</span>
                  <span class="font-semibold text-gray-900">{{ demande()!.quantiteDemandee }} ml</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Urgence:</span>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    [class.bg-red-100]="demande()!.urgence === 'CRITIQUE'"
                    [class.text-red-800]="demande()!.urgence === 'CRITIQUE'"
                    [class.bg-orange-100]="demande()!.urgence === 'HAUTE'"
                    [class.text-orange-800]="demande()!.urgence === 'HAUTE'"
                    [class.bg-yellow-100]="demande()!.urgence === 'NORMALE'"
                    [class.text-yellow-800]="demande()!.urgence === 'NORMALE'"
                    [class.bg-green-100]="demande()!.urgence === 'BASSE'"
                    [class.text-green-800]="demande()!.urgence === 'BASSE'"
                  >
                    {{ demande()!.urgence }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Hospital Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Hôpital</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Nom:</span>
                  <span class="font-semibold text-gray-900">{{ demande()?.hopitalNom ?? 'Non spécifié' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Ville:</span>
                  <span class="font-semibold text-gray-900">{{ demande()?.hopitalNom ?? 'Non spécifié' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Téléphone:</span>
                  <span class="font-semibold text-gray-900">Non disponible</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Medical Reason -->
          <div class="p-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Raison médicale</h3>
            <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-700">
                @if (demande()?.diagnostic) {
                  {{ demande()?.diagnostic }}
                } @else {
                  <span class="text-gray-500 italic">Aucun diagnostic spécifié</span>
                }
              </p>
            </div>
          </div>

          <!-- Dates -->
          <div class="p-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Dates importantes</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-sm text-blue-600 mb-1">Date de la demande</p>
                <p class="font-semibold text-blue-900">{{ demande()!.dateDemande | date:'full' }}</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <p class="text-sm text-green-600 mb-1">Dernière mise à jour</p>
                <p class="font-semibold text-green-900">{{ demande()!.dateTraitement ? (demande()!.dateTraitement | date:'full') : 'Non traité' }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-6 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <button
                (click)="goBack()"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <div class="flex items-center gap-3">
                @if (demande()!.statut === 'EN_ATTENTE') {
                  <button
                    (click)="cancelDemande()"
                    class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                  >
                    Annuler
                  </button>
                }
                <button
                  (click)="printDemande()"
                  class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                >
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-gray-400">error</span>
          <p class="text-gray-500 mt-4">Demande non trouvée</p>
          <button
            (click)="goBack()"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      }
    </div>
  `,
})
export class DemandDetailComponent implements OnInit {
  demande = signal<DemandeSangResponse | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientApi: PatientApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDemande(Number(id));
    } else {
      this.loading.set(false);
    }
  }

  private loadDemande(id: number): void {
    this.patientApi.getDemande(id).subscribe({
      next: (demande) => {
        this.demande.set(demande);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  editDemande(): void {
    // Navigate to edit form
    console.log('Edit demande:', this.demande());
  }

  cancelDemande(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande?')) {
      // TODO: Implement cancel API call
      console.log('Cancel demande:', this.demande());
    }
  }

  printDemande(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/patient/demandes']);
  }
}
