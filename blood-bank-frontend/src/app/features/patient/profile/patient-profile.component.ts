import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import type { DemandeSangResponse } from '../../../core/models/types';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Mon profil patient</h2>

      @if (loading()) {
        <p class="text-gray-500">Chargement du profil...</p>
      } @else if (currentUser(); as user) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile card -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span class="material-symbols-outlined text-3xl text-blue-600">medical_services</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">{{ user.prenom }} {{ user.nom }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ user.email }}</p>

                <!-- Blood Type Display -->
                @if (currentUser()?.groupeSanguin) {
                  <div class="mt-4 w-full">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p class="text-xs text-blue-600 font-medium mb-1">Votre groupe sanguin</p>
                      <div class="flex items-center justify-center">
                        <span class="text-2xl font-bold text-blue-800">{{ currentUser()?.groupeSanguin }}</span>
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="mt-4 w-full">
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p class="text-xs text-yellow-600 font-medium mb-1">Groupe sanguin non défini</p>
                      <button
                        (click)="showBloodTypeForm.set(true)"
                        class="w-full mt-2 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Définir mon groupe sanguin
                      </button>
                    </div>
                  </div>
                }

                <!-- Role Toggle -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Mode actuel</h4>
                  <div class="space-y-3">
                    <label class="flex items-center justify-between">
                      <span class="text-sm text-gray-700">Mode Donneur</span>
                      <div class="relative">
                        <input
                          type="checkbox"
                          [checked]="currentUser()?.isDonneurActif"
                          (change)="toggleDonneurRole($event)"
                          class="sr-only peer"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-sm text-gray-700">Mode Patient</span>
                      <div class="relative">
                        <input
                          type="checkbox"
                          [checked]="currentUser()?.isPatientActif"
                          (change)="togglePatientRole($event)"
                          class="sr-only peer"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </label>
                  </div>
                  @if (roleToggleMessage()) {
                    <div class="mt-3 p-2 rounded-lg bg-blue-50 text-blue-700 text-xs">
                      {{ roleToggleMessage() }}
                    </div>
                  }
                </div>
              </div>

              <!-- Stats -->
              <div class="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Demandes totales</span>
                  <span class="text-lg font-semibold text-gray-900">{{ demandes().length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Demandes satisfaites</span>
                  <span class="text-lg font-semibold text-green-600">
                    {{ demandes().filter(d => d.statut === 'SATISFAITE').length }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Demandes en attente</span>
                  <span class="text-lg font-semibold text-orange-600">
                    {{ demandes().filter(d => d.statut === 'EN_ATTENTE').length }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Content area -->
          <div class="lg:col-span-2">
            <!-- Blood Type Form -->
            @if (showBloodTypeForm()) {
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Définir votre groupe sanguin</h3>
                <form [formGroup]="bloodTypeForm" (ngSubmit)="saveBloodType()" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin</label>
                    <select
                      formControlName="groupeSanguin"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un groupe</option>
                      <option value="O_POSITIF">O+</option>
                      <option value="O_NEGATIF">O-</option>
                      <option value="A_POSITIF">A+</option>
                      <option value="A_NEGATIF">A-</option>
                      <option value="B_POSITIF">B+</option>
                      <option value="B_NEGATIF">B-</option>
                      <option value="AB_POSITIF">AB+</option>
                      <option value="AB_NEGATIF">AB-</option>
                    </select>
                  </div>
                  <div class="flex gap-3">
                    <button
                      type="button"
                      (click)="showBloodTypeForm.set(false)"
                      class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      [disabled]="bloodTypeForm.invalid"
                      class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            }

            <!-- Hospital Selection -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sélectionner un hôpital</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                @for (hospital of availableHospitals(); track hospital.id) {
                  <div 
                    class="border border-gray-200 rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50"
                    [class]="selectedHospital()?.id === hospital.id ? 'border-blue-500 bg-blue-50' : ''"
                    (click)="selectHospital(hospital)"
                  >
                    <h4 class="font-medium text-gray-900">{{ hospital.nom }}</h4>
                    <p class="text-sm text-gray-500">{{ hospital.adresse }}</p>
                    <p class="text-sm text-gray-500">{{ hospital.telephone }}</p>
                  </div>
                }
              </div>
              
              @if (selectedHospital()) {
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-2">Stock disponible</h4>
                  @if (stockLevels().length === 0) {
                    <p class="text-sm text-gray-500">Chargement des stocks...</p>
                  } @else {
                    <div class="space-y-2">
                      @for (stock of stockLevels(); track stock.groupeSanguin) {
                        <div class="flex justify-between items-center">
                          <span class="text-sm font-medium">{{ stock.groupeSanguin }}</span>
                          <div class="flex items-center gap-2">
                            <div class="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                class="h-2 rounded-full"
                                [class]="getStockColor(stock)"
                                [style.width]="getStockPercentage(stock) + '%'"
                              ></div>
                            </div>
                            <span class="text-sm text-gray-600">{{ stock.quantite }} ml</span>
                          </div>
                        </div>
                      }
                    </div>
                  }
                  
                  <button
                    (click)="createBloodRequest()"
                    [disabled]="!currentUser()?.groupeSanguin"
                    class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    @if (currentUser()?.groupeSanguin) {
                      Créer une demande de sang
                    } @else {
                      Définir d'abord votre groupe sanguin
                    }
                  </button>
                </div>
              }
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Mes demandes de sang</h3>
              
              @if (demandes().length === 0) {
                <div class="text-center py-8">
                  <span class="material-symbols-outlined text-4xl text-gray-400">bloodtype</span>
                  <p class="text-gray-500 mt-2">Vous n'avez pas encore fait de demandes</p>
                  <button
                    (click)="createNewDemande()"
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Faire une demande
                  </button>
                </div>
              } @else {
                <div class="space-y-3">
                  @for (demande of demandes(); track demande.id) {
                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-2">
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {{ demande.groupeSanguinDemande }}
                            </span>
                            <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                              {{ demande.urgence }}
                            </span>
                          </div>
                          <p class="text-sm text-gray-900 font-medium">
                            Quantité: {{ demande.quantiteDemandee }} ml
                          </p>
                          <p class="text-sm text-gray-500">
                            Hôpital: {{ demande.hopitalNom }}
                          </p>
                          <p class="text-xs text-gray-400">
                            {{ demande.dateDemande | date:'short' }}
                          </p>
                        </div>
                        <div class="text-right">
                          <span class="px-2 py-1 rounded-full text-xs font-medium
                            {{ demande.statut === 'SATISFAITE' ? 'bg-green-100 text-green-800' : 
                               demande.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                               demande.statut === 'ANNULEE' ? 'bg-red-100 text-red-800' :
                               'bg-gray-100 text-gray-800' }}">
                            {{ demande.statut }}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
              
              <div class="mt-6 flex justify-center">
                <button
                  (click)="createNewDemande()"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nouvelle demande
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class PatientProfileComponent implements OnInit {
  currentUser = signal<any>(null);
  demandes = signal<DemandeSangResponse[]>([]);
  loading = signal(true);
  roleToggleMessage = signal<string | null>(null);
  showBloodTypeForm = signal(false);
  bloodTypeForm: FormGroup;
  availableHospitals = signal<any[]>([]);
  selectedHospital = signal<any>(null);
  stockLevels = signal<any[]>([]);

  constructor(
    private patientApi: PatientApiService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.bloodTypeForm = this.fb.group({
      groupeSanguin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    this.loadDemandes();
    this.loadHospitals();
  }

  getStockPercentage(stock: any): number {
    return Math.min((stock.quantite / 20) * 100, 100);
  }

  getStockColor(stock: any): string {
    return stock.quantite > 10 ? 'bg-green-500' : stock.quantite > 5 ? 'bg-yellow-500' : 'bg-red-500';
  }

  private loadDemandes(): void {
    this.patientApi.getMesDemandes().subscribe({
      next: (demandes: DemandeSangResponse[]) => {
        this.demandes.set(demandes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveBloodType(): void {
    if (this.bloodTypeForm.invalid) return;
    
    const currentUser = this.currentUser();
    if (!currentUser) return;
    
    this.patientApi.updateBloodType(this.bloodTypeForm.value.groupeSanguin).subscribe({
      next: (updatedUser) => {
        const userWithBloodType = {
          ...currentUser,
          groupeSanguin: this.bloodTypeForm.value.groupeSanguin
        };
        this.currentUser.set(userWithBloodType);
        this.authService.refreshUser(userWithBloodType);
        this.showBloodTypeForm.set(false);
      },
      error: () => {
        alert('Erreur lors de la mise à jour du groupe sanguin');
      }
    });
  }

  loadHospitals(): void {
    this.patientApi.getHospitals().subscribe({
      next: (hospitals) => {
        this.availableHospitals.set(hospitals);
      },
      error: () => {
        // Fallback to mock data if API fails
        this.availableHospitals.set([
          {
            id: 1,
            nom: 'Hôpital Ibn Sina',
            adresse: '123 Avenue des FAR, Rabat',
            telephone: '+212-537-123456',
            ville: 'Rabat',
            region: 'Rabat-Salé-Zemmour-Zaër',
            email: 'contact@ibnsina.ma',
            statut: 'VALIDE',
            capaciteStockage: 1000,
            stockActuel: 750,
            certifie: true,
            scorePerformance: 4.5,
            description: 'Hôpital universitaire de référence'
          },
          {
            id: 2,
            nom: 'Centre Hospitalier Universitaire',
            adresse: '456 Boulevard Mohammed V, Casablanca',
            telephone: '+212-522-987654',
            ville: 'Casablanca',
            region: 'Grand Casablanca',
            email: 'info@chu-casa.ma',
            statut: 'VALIDE',
            capaciteStockage: 1500,
            stockActuel: 1200,
            certifie: true,
            scorePerformance: 4.8,
            description: 'Centre hospitalier universitaire de Casablanca'
          },
          {
            id: 3,
            nom: 'Hôpital Hassan II',
            adresse: '789 Rue Al Massira, Fès',
            telephone: '+212-535-456789',
            ville: 'Fès',
            region: 'Fès-Boulemane',
            email: 'contact@hassan2.ma',
            statut: 'VALIDE',
            capaciteStockage: 800,
            stockActuel: 600,
            certifie: true,
            scorePerformance: 4.2,
            description: 'Hôpital régional de Fès'
          }
        ]);
      }
    });
  }

  selectHospital(hospital: any): void {
    this.selectedHospital.set(hospital);
    this.loadStockLevels(hospital.id);
  }

  loadStockLevels(hospitalId: number): void {
    this.patientApi.getStocks(hospitalId).subscribe({
      next: (stocks) => {
        this.stockLevels.set(stocks);
      }
    });
  }

  createBloodRequest(): void {
    const currentUser = this.currentUser();
    if (!currentUser || !currentUser.groupeSanguin) {
      alert('Veuillez d\'abord définir votre groupe sanguin');
      return;
    }
    
    if (!this.selectedHospital()) {
      alert('Veuillez sélectionner un hôpital');
      return;
    }
    
    // Save selected hospital and navigate to form
    localStorage.setItem('selected_hospital', JSON.stringify(this.selectedHospital()));
    
    const hasBloodType = this.stockLevels().some(stock => 
      stock.groupeSanguin === currentUser.groupeSanguin && stock.quantite > 0
    );
    
    if (!hasBloodType) {
      const confirmRequest = confirm(
        `Cet hôpital n'a pas de stock pour votre groupe sanguin (${currentUser.groupeSanguin}).\n` +
        'Voulez-vous quand même créer une demande ? L\'hôpital pourra contacter des donneurs.'
      );
      
      if (!confirmRequest) return;
    }
    
    // Navigate to request form
    window.location.href = '/patient/demandes/form';
  }

  createNewDemande(): void {
    // Navigate to demande creation page
    // TODO: Implement navigation to demande creation
    console.log('Navigate to demande creation');
  }

  toggleDonneurRole(event: any): void {
    const isChecked = event.target.checked;
    const currentUser = this.currentUser();
    
    if (!currentUser) return;
    
    // Update local state immediately
    const updatedUser = {
      ...currentUser,
      isDonneurActif: isChecked,
      isPatientActif: isChecked ? false : currentUser.isPatientActif
    };
    this.currentUser.set(updatedUser);
    
    // Call API to update server
    this.patientApi.toggleRole({
      isDonneurActif: isChecked,
      isPatientActif: updatedUser.isPatientActif
    }).subscribe({
      next: () => {
        this.roleToggleMessage.set(isChecked ? 'Mode Donneur activé' : 'Mode Donneur désactivé');
        setTimeout(() => this.roleToggleMessage.set(null), 3000);
        
        // Update auth service with new user data
        this.authService.refreshUser(updatedUser);
      },
      error: () => {
        this.roleToggleMessage.set('Erreur lors de la mise à jour des rôles');
        setTimeout(() => this.roleToggleMessage.set(null), 3000);
      }
    });
  }

  togglePatientRole(event: any): void {
    const isChecked = event.target.checked;
    const currentUser = this.currentUser();
    
    if (!currentUser) return;
    
    // Update local state immediately
    const updatedUser = {
      ...currentUser,
      isPatientActif: isChecked,
      isDonneurActif: isChecked ? false : currentUser.isDonneurActif
    };
    this.currentUser.set(updatedUser);
    
    // Call API to update server
    this.patientApi.toggleRole({
      isDonneurActif: updatedUser.isDonneurActif,
      isPatientActif: isChecked
    }).subscribe({
      next: () => {
        this.roleToggleMessage.set(isChecked ? 'Mode Patient activé' : 'Mode Patient désactivé');
        setTimeout(() => this.roleToggleMessage.set(null), 3000);
        
        // Update auth service with new user data
        this.authService.refreshUser(updatedUser);
      },
      error: () => {
        this.roleToggleMessage.set('Erreur lors de la mise à jour des rôles');
        setTimeout(() => this.roleToggleMessage.set(null), 3000);
      }
    });
  }
}
