import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import type { DemandeSangResponse, StatutDemande, HopitalResponse, StockResponse } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected' | 'inprogress';

interface StockCheck {
  hasStock: boolean;
  availableQuantity: number;
  requestedQuantity: number;
  shortage: number;
}

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
            <p class="text-gray-600 mt-1">Gérez les demandes de sang des patients avec vérification des stocks</p>
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock disponible</th>
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
                      @if (getStockCheck(demande); as stockCheck) {
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium">{{ stockCheck.availableQuantity }} ml</span>
                          @if (!stockCheck.hasStock) {
                            <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Manque: {{ stockCheck.shortage }} ml
                            </span>
                          } @else {
                            <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Suffisant
                            </span>
                          }
                        </div>
                      }
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

                        <!-- Patient Info Validation Indicator -->
                        @if (!hasValidPatientInfo(demande)) {
                          <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full" title="Informations patient manquantes">
                            <span class="material-symbols-outlined text-xs mr-1">warning</span>
                            Patient invalide
                          </span>
                        }

                        <!-- Action Buttons -->
                        @if (demande.statut === 'EN_ATTENTE') {
                          @if (hasValidPatientInfo(demande)) {
                            @if (getStockCheck(demande); as stockCheck) {
                              @if (stockCheck.hasStock) {
                                <!-- Has stock - can approve -->
                                <button
                                  (click)="approveDemand(demande.id)"
                                  class="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                  title="Approuver (stock disponible)"
                                >
                                  <span class="material-symbols-outlined text-sm mr-1">check_circle</span>
                                  Approuver
                                </button>
                              } @else {
                                <!-- No stock - create donor request -->
                                <button
                                  (click)="createDonorRequest(demande)"
                                  class="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                                  title="Créer une demande de donneurs"
                                >
                                  <span class="material-symbols-outlined text-sm mr-1">campaign</span>
                                  Demander aux donneurs
                                </button>
                              }
                            }
                          } @else {
                            <!-- Invalid patient info - cannot process -->
                            <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full" title="Impossible de traiter cette demande">
                              Non traitable
                            </span>
                          }
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

      <!-- Donor Request Modal -->
      @if (showDonorRequestModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900">Créer une demande de donneurs</h3>
                <button
                  (click)="closeDonorRequestModal()"
                  class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              @if (selectedDemandeForRequest(); as demande) {
                <!-- Demand Info -->
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 class="font-medium text-red-900 mb-3">Demande de sang initiale</h4>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-red-700">Patient:</span>
                      <span class="ml-2 font-medium">{{ demande.nomPatient }} {{ demande.prenomPatient }}</span>
                    </div>
                    <div>
                      <span class="text-red-700">Groupe sanguin:</span>
                      <span class="ml-2">
                        <app-blood-type-badge [groupeSanguin]="demande.groupeSanguinDemande" />
                      </span>
                    </div>
                    <div>
                      <span class="text-red-700">Quantité requise:</span>
                      <span class="ml-2 font-medium">{{ demande.quantiteDemandee }} ml</span>
                    </div>
                    <div>
                      <span class="text-red-700">Stock disponible:</span>
                      <span class="ml-2 font-medium">{{ getStockCheck(demande)?.availableQuantity || 0 }} ml</span>
                    </div>
                  </div>
                </div>

                <!-- Donor Request Form -->
                <form [formGroup]="donorRequestForm" (ngSubmit)="submitDonorRequest()">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Titre de la campagne</label>
                      <input
                        formControlName="titre"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Urgence: Besoin de sang {{ demande.groupeSanguinDemande }}"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        formControlName="description"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Besoin urgent de sang pour le patient {{ demande.nomPatient }} {{ demande.prenomPatient }}"
                      ></textarea>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Objectif de donneurs</label>
                      <input
                        formControlName="objectifDonneurs"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre de donneurs nécessaires"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Lieu de collecte</label>
                      <input
                        formControlName="lieuCollecte"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Hôpital Principal"
                      >
                    </div>
                  </div>

                  <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      (click)="closeDonorRequestModal()"
                      class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      [disabled]="!donorRequestForm.valid || creatingDonorRequest()"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      @if (creatingDonorRequest()) {
                        <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Création...
                      } @else {
                        Créer la demande
                      }
                    </button>
                  </div>
                </form>
              }
            </div>
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
                  @if (getStockCheck(selectedDemande()!); as stockCheck) {
                    <div class="col-span-2 mt-3 p-3 rounded-lg" [class]="stockCheck.hasStock ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'">
                      <span class="font-medium" [class]="stockCheck.hasStock ? 'text-green-900' : 'text-red-900'">
                        Stock disponible: {{ stockCheck.availableQuantity }} ml
                      </span>
                      @if (!stockCheck.hasStock) {
                        <div class="text-red-800 mt-1">
                          Manque: {{ stockCheck.shortage }} ml
                        </div>
                      }
                    </div>
                  }
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
                    @if (getStockCheck(selectedDemande()!); as stockCheck) {
                      @if (stockCheck.hasStock) {
                        <button
                          (click)="approveDemand(selectedDemande()!.id); closeDetails();"
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Approuver (stock disponible)
                        </button>
                      } @else {
                        <button
                          (click)="createDonorRequest(selectedDemande()!); closeDetails();"
                          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Demander aux donneurs
                        </button>
                      }
                    }
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
  stocks = signal<StockResponse[]>([]);
  loading = signal(true);
  activeTab = signal<FilterTab>('all');
  selectedDemande = signal<DemandeSangResponse | null>(null);
  selectedDemandeForRequest = signal<DemandeSangResponse | null>(null);
  showDonorRequestModal = signal(false);
  creatingDonorRequest = signal(false);
  donorRequestForm: FormGroup;

  filterTabs = signal<{ value: FilterTab; label: string; count: number }[]>([
    { value: 'all', label: 'Toutes', count: 0 },
    { value: 'pending', label: 'En attente', count: 0 },
    { value: 'inprogress', label: 'En cours', count: 0 },
    { value: 'approved', label: 'Approuvées', count: 0 },
    { value: 'rejected', label: 'Rejetées', count: 0 }
  ]);

  constructor(
    private patientApi: PatientApiService,
    private adminApi: AdminApiService,
    private fb: FormBuilder
  ) {
    this.donorRequestForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      objectifDonneurs: [5, [Validators.required, Validators.min(1)]],
      lieuCollecte: ['Hôpital Principal', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDemands();
    this.loadStocks();
  }

  private loadDemands(): void {
    this.loading.set(true);
    this.adminApi.getDemandes().subscribe({
      next: (allDemandes: DemandeSangResponse[]) => {
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

  private loadStocks(): void {
    this.adminApi.getStocks().subscribe({
      next: (stocks: StockResponse[]) => {
        this.stocks.set(stocks);
      },
      error: (error) => {
        console.error('Error loading stocks:', error);
      }
    });
  }

  getStockCheck(demande: DemandeSangResponse): StockCheck | null {
    const stock = this.stocks().find(s => s.groupeSanguin === demande.groupeSanguinDemande);
    if (!stock) return null;

    const availableQuantity = stock.quantiteDisponible;
    const requestedQuantity = demande.quantiteDemandee;
    const hasStock = availableQuantity >= requestedQuantity;
    const shortage = hasStock ? 0 : requestedQuantity - availableQuantity;

    return {
      hasStock,
      availableQuantity,
      requestedQuantity,
      shortage
    };
  }

  hasValidPatientInfo(demande: DemandeSangResponse): boolean {
    return !!(demande.patientId && demande.patientEmail && demande.nomPatient && demande.prenomPatient);
  }

  approveDemand(id: number): void {
    this.updateStatus(id, 'SATISFAITE');
  }

  createDonorRequest(demande: DemandeSangResponse): void {
    this.selectedDemandeForRequest.set(demande);
    this.showDonorRequestModal.set(true);
    
    // Pre-fill form with default values
    const shortage = this.getStockCheck(demande)?.shortage || demande.quantiteDemandee;
    const estimatedDonors = Math.ceil(shortage / 450); // Average donation per person
    
    this.donorRequestForm.patchValue({
      titre: `Urgence: Besoin de sang ${demande.groupeSanguinDemande}`,
      description: `Besoin urgent de sang pour le patient ${demande.nomPatient} ${demande.prenomPatient}`,
      objectifDonneurs: estimatedDonors,
      lieuCollecte: 'Hôpital Principal'
    });
  }

  closeDonorRequestModal(): void {
    this.showDonorRequestModal.set(false);
    this.selectedDemandeForRequest.set(null);
    this.donorRequestForm.reset();
  }

  submitDonorRequest(): void {
    if (!this.donorRequestForm.valid || !this.selectedDemandeForRequest()) return;

    this.creatingDonorRequest.set(true);
    const formValue = this.donorRequestForm.value;
    const demande = this.selectedDemandeForRequest()!;

    // Create campaign request (this would call your campaign API)
    const campaignData = {
      titre: formValue.titre,
      description: formValue.description,
      groupeSanguinCible: demande.groupeSanguinDemande,
      objectifDonneurs: formValue.objectifDonneurs,
      lieuCollecte: formValue.lieuCollecte,
      nationale: false,
      statut: 'PLANIFIEE'
    };

    // Mock API call - replace with actual campaign creation
    setTimeout(() => {
      this.creatingDonorRequest.set(false);
      this.closeDonorRequestModal();
      
      // Update demand status to EN_COURS
      this.updateStatus(demande.id, 'EN_COURS');
      
      alert('Demande de donneurs créée avec succès! Les donneurs seront notifiés.');
    }, 1500);
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
    // Find the demand to check if it has valid patient data
    const demande = this.demandes().find((d: DemandeSangResponse) => d.id === id);
    
    if (!demande) {
      console.error('Demand not found:', id);
      alert('Demande non trouvée');
      return;
    }

    // Check if the demand has valid patient information
    if (!demande.patientId || !demande.patientEmail) {
      console.error('Demand has invalid patient information:', demande);
      alert('Cette demande ne contient pas d\'informations patient valides. Impossible de la traiter.');
      return;
    }

    // Show loading state
    const originalStatus = demande.statut;
    
    // Optimistically update the UI
    this.demandes.update((list: DemandeSangResponse[]) => 
      list.map((d: DemandeSangResponse) => 
        d.id === id ? { ...d, statut: status } : d
      )
    );

    // Call the API
    this.adminApi.traiterDemande(id, status).subscribe({
      next: (updated: DemandeSangResponse) => {
        // Update with the server response
        this.demandes.update((list: DemandeSangResponse[]) => 
          list.map((d: DemandeSangResponse) => d.id === updated.id ? updated : d)
        );
        this.updateFilterCounts();
        
        // Show success message
        const statusMessages: Record<StatutDemande, string> = {
          'EN_ATTENTE': 'Demande mise en attente avec succès!',
          'EN_COURS': 'Demande mise en cours avec succès!',
          'SATISFAITE': 'Demande approuvée avec succès!',
          'ANNULEE': 'Demande annulée avec succès!',
          'REJETEE': 'Demande rejetée avec succès!'
        };
        
        alert(statusMessages[status] || 'Statut mis à jour avec succès!');
      },
      error: (error: any) => {
        console.error('Error updating demand status:', error);
        
        // Revert the optimistic update
        this.demandes.update((list: DemandeSangResponse[]) => 
          list.map((d: DemandeSangResponse) => 
            d.id === id ? { ...d, statut: originalStatus } : d
          )
        );
        
        // Show appropriate error message
        if (error.status === 400 && error.error?.message?.includes('patient')) {
          alert('Erreur: Cette demande ne contient pas d\'informations patient valides. Veuillez contacter l\'administrateur.');
        } else if (error.status === 403) {
          alert('Erreur: Vous n\'avez pas les permissions pour traiter cette demande.');
        } else if (error.status === 404) {
          alert('Erreur: Demande non trouvée.');
        } else {
          alert('Erreur lors de la mise à jour du statut: ' + (error.error?.message || error.message || 'Erreur inconnue'));
        }
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
