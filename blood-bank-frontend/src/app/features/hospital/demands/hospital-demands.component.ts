import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import type { DemandeSangResponse, StatutDemande, HopitalResponse } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected' | 'inprogress';

@Component({
  selector: 'app-hospital-demands',
  standalone: true,
  imports: [CommonModule, DatePipe, StatusBadgeComponent, BloodTypeBadgeComponent, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestion des demandes de sang</h1>
            <p class="text-gray-600 mt-1">Gérez les demandes de sang des patients pour votre hôpital</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-500">
              Total: <span class="font-semibold text-gray-900">{{ demandes().length }}</span> demandes
            </div>
            <div class="text-sm text-green-600">
              En attente: <span class="font-semibold">{{ pendingCount() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div class="flex space-x-1">
          @for (tab of filterTabs(); track tab.value) {
            <button
              (click)="activeTab.set(tab.value)"
              [class]="activeTab() === tab.value ? 
                'px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white' : 
                'px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
            >
              {{ tab.label }}
              <span class="ml-2 px-2 py-0.5 text-xs rounded-full"
                [class]="activeTab() === tab.value ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'"
              >
                {{ tab.count }}
              </span>
            </button>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Chargement des demandes...</p>
        </div>
      } @else if (filteredDemandes().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <span class="material-symbols-outlined text-4xl text-gray-400">inbox</span>
          <p class="text-gray-600 mt-4">Aucune demande trouvée</p>
        </div>
      } @else {
        <!-- Demands List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groupe sanguin</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgence</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (demande of filteredDemandes(); track demande.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ demande.nomPatient }} {{ demande.prenomPatient }}
                      </div>
                      <div class="text-sm text-gray-500">{{ demande.patientEmail }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <app-blood-type-badge [groupeSanguin]="demande.groupeSanguinDemande" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ demande.quantiteDemandee }} ml
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 rounded text-xs font-medium"
                        [class]="getUrgencyClass(demande.urgence)"
                      >
                        {{ demande.urgence }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ demande.dateDemande | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <app-status-badge [status]="demande.statut" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center gap-2">
                        <!-- View Details -->
                        <button
                          (click)="viewDetails(demande.id)"
                          class="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          title="Voir les détails"
                        >
                          <span class="material-symbols-outlined text-sm">visibility</span>
                        </button>

                        <!-- Action Buttons -->
                        @if (demande.statut === 'EN_ATTENTE') {
                          <button
                            (click)="updateStatus(demande.id, 'EN_COURS')"
                            class="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors"
                          >
                            En cours
                          </button>
                          <button
                            (click)="updateStatus(demande.id, 'SATISFAITE')"
                            class="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                          >
                            Approuver
                          </button>
                          <button
                            (click)="updateStatus(demande.id, 'REJETEE')"
                            class="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            title="Rejeter"
                          >
                            <span class="material-symbols-outlined text-sm">close</span>
                          </button>
                        } @else if (demande.statut === 'EN_COURS') {
                          <button
                            (click)="updateStatus(demande.id, 'SATISFAITE')"
                            class="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                          >
                            Terminer
                          </button>
                          <button
                            (click)="updateStatus(demande.id, 'REJETEE')"
                            class="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            title="Rejeter"
                          >
                            <span class="material-symbols-outlined text-sm">close</span>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Details Modal -->
      @if (selectedDemande()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900">Détails de la demande</h3>
                <button
                  (click)="closeDetails()"
                  class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Patient Info -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Informations patient</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Nom:</span>
                    <span class="ml-2 font-medium">{{ selectedDemande()!.nomPatient }} {{ selectedDemande()!.prenomPatient }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Email:</span>
                    <span class="ml-2 font-medium">{{ selectedDemande()!.patientEmail }}</span>
                  </div>
                </div>
              </div>

              <!-- Request Info -->
              <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Détails de la demande</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Groupe sanguin:</span>
                    <span class="ml-2">
                      <app-blood-type-badge [groupeSanguin]="selectedDemande()!.groupeSanguinDemande" />
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-600">Quantité:</span>
                    <span class="ml-2 font-medium">{{ selectedDemande()!.quantiteDemandee }} ml</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Urgence:</span>
                    <span class="ml-2 font-medium">{{ selectedDemande()!.urgence }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Date demande:</span>
                    <span class="ml-2 font-medium">{{ selectedDemande()!.dateDemande | date:'full' }}</span>
                  </div>
                </div>
              </div>

              <!-- Medical Info -->
              <div class="bg-yellow-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Informations médicales</h4>
                <div class="text-sm space-y-2">
                  <div>
                    <span class="text-gray-600">Diagnostic:</span>
                    <p class="mt-1 p-2 bg-white rounded border border-gray-200">{{ selectedDemande()!.diagnostic }}</p>
                  </div>
                  @if (selectedDemande()!.notes) {
                    <div>
                      <span class="text-gray-600">Notes:</span>
                      <p class="mt-1 p-2 bg-white rounded border border-gray-200">{{ selectedDemande()!.notes }}</p>
                    </div>
                  }
                </div>
              </div>

              <!-- Status Actions -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span class="text-gray-600">Statut actuel:</span>
                  <span class="ml-2">
                    <app-status-badge [status]="selectedDemande()!.statut" />
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  @if (selectedDemande()!.statut === 'EN_ATTENTE') {
                    <button
                      (click)="updateStatus(selectedDemande()!.id, 'EN_COURS'); closeDetails();"
                      class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                    >
                      Mettre en cours
                    </button>
                    <button
                      (click)="updateStatus(selectedDemande()!.id, 'SATISFAITE'); closeDetails();"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approuver
                    </button>
                    <button
                      (click)="updateStatus(selectedDemande()!.id, 'REJETEE'); closeDetails();"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Rejeter
                    </button>
                  } @else if (selectedDemande()!.statut === 'EN_COURS') {
                    <button
                      (click)="updateStatus(selectedDemande()!.id, 'SATISFAITE'); closeDetails();"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Terminer
                    </button>
                    <button
                      (click)="updateStatus(selectedDemande()!.id, 'REJETEE'); closeDetails();"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Rejeter
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class HospitalDemandsComponent implements OnInit {
  demandes = signal<DemandeSangResponse[]>([]);
  loading = signal(true);
  activeTab = signal<FilterTab>('all');
  selectedDemande = signal<DemandeSangResponse | null>(null);

  filterTabs = signal<{ value: FilterTab; label: string; count: number }[]>([
    { value: 'all', label: 'Toutes', count: 0 },
    { value: 'pending', label: 'En attente', count: 0 },
    { value: 'inprogress', label: 'En cours', count: 0 },
    { value: 'approved', label: 'Approuvées', count: 0 },
    { value: 'rejected', label: 'Rejetées', count: 0 }
  ]);

  constructor(
    private patientApi: PatientApiService,
    private adminApi: AdminApiService
  ) {}

  ngOnInit(): void {
    this.loadDemands();
  }

  private loadDemands(): void {
    this.loading.set(true);
    // For hospital, we need to get all demands, not just the current user's demands
    // Using admin API to get all demands, then filter by hospital
    this.adminApi.getDemandes().subscribe({
      next: (allDemandes: DemandeSangResponse[]) => {
        // For now, show all demands - in real app, filter by hospital ID
        // TODO: Filter by hospital ID when hospital auth is implemented
        this.demandes.set(allDemandes);
        this.updateFilterCounts();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading demands:', error);
        this.loading.set(false);
      }
    });
  }

  private updateFilterCounts(): void {
    const all: DemandeSangResponse[] = this.demandes();
    this.filterTabs.set([
      { value: 'all', label: 'Toutes', count: all.length },
      { value: 'pending', label: 'En attente', count: all.filter((d: DemandeSangResponse) => d.statut === 'EN_ATTENTE').length },
      { value: 'inprogress', label: 'En cours', count: all.filter((d: DemandeSangResponse) => d.statut === 'EN_COURS').length },
      { value: 'approved', label: 'Approuvées', count: all.filter((d: DemandeSangResponse) => d.statut === 'SATISFAITE').length },
      { value: 'rejected', label: 'Rejetées', count: all.filter((d: DemandeSangResponse) => d.statut === 'REJETEE').length }
    ]);
  }

  filteredDemandes = computed(() => {
    const all: DemandeSangResponse[] = this.demandes();
    const tab = this.activeTab();
    
    switch (tab) {
      case 'pending':
        return all.filter((d: DemandeSangResponse) => d.statut === 'EN_ATTENTE');
      case 'inprogress':
        return all.filter((d: DemandeSangResponse) => d.statut === 'EN_COURS');
      case 'approved':
        return all.filter((d: DemandeSangResponse) => d.statut === 'SATISFAITE');
      case 'rejected':
        return all.filter((d: DemandeSangResponse) => d.statut === 'REJETEE');
      default:
        return all;
    }
  });

  pendingCount = computed(() => {
    return this.demandes().filter((d: DemandeSangResponse) => d.statut === 'EN_ATTENTE').length;
  });

  updateStatus(id: number, status: StatutDemande): void {
    this.adminApi.traiterDemande(id, status).subscribe({
      next: (updated: DemandeSangResponse) => {
        this.demandes.update((list: DemandeSangResponse[]) => 
          list.map((d: DemandeSangResponse) => d.id === updated.id ? updated : d)
        );
        this.updateFilterCounts();
      },
      error: (error: any) => {
        console.error('Error updating demand status:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  viewDetails(id: number): void {
    const demande = this.demandes().find((d: DemandeSangResponse) => d.id === id);
    if (demande) {
      this.selectedDemande.set(demande);
    }
  }

  closeDetails(): void {
    this.selectedDemande.set(null);
  }

  getUrgencyClass(urgence: string): string {
    switch (urgence) {
      case 'CRITIQUE':
        return 'bg-red-100 text-red-800';
      case 'HAUTE':
        return 'bg-orange-100 text-orange-800';
      case 'NORMALE':
        return 'bg-yellow-100 text-yellow-800';
      case 'BASSE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
