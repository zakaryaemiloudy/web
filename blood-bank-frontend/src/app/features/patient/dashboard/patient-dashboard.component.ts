import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import type { DemandeSangResponse, HopitalResponse } from '../../../core/models/types';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tableau de bord patient</h1>
        <p class="text-gray-600 mt-2">
          Vue d'ensemble de vos demandes et des disponibilités de sang.
        </p>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-gray-400 animate-spin">refresh</span>
          <p class="text-gray-500 mt-4">Chargement du tableau de bord...</p>
        </div>
      } @else {
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-blue-600">emergency</span>
              </div>
              <span class="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">{{ demandes().length }}</h3>
            <p class="text-gray-600 text-sm">Demandes totales</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-green-600">check_circle</span>
              </div>
              <span class="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ demandes().filter(d => d.statut === 'SATISFAITE').length }}
            </h3>
            <p class="text-gray-600 text-sm">Demandes satisfaites</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-yellow-600">pending</span>
              </div>
              <span class="text-sm text-yellow-600 font-medium">En cours</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ demandes().filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'EN_COURS').length }}
            </h3>
            <p class="text-gray-600 text-sm">Demandes en attente</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-purple-600">local_hospital</span>
              </div>
              <span class="text-sm text-purple-600 font-medium">Disponibles</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">{{ hospitals().length }}</h3>
            <p class="text-gray-600 text-sm">Hôpitaux actifs</p>
          </div>
        </div>

        <!-- Blood Type Info -->
        @if (currentUser()?.groupeSanguin) {
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-blue-900 mb-2">Votre groupe sanguin</h3>
                <div class="flex items-center gap-4">
                  <span class="text-3xl font-bold text-blue-800">{{ currentUser()?.groupeSanguin }}</span>
                  <span class="text-blue-600">Ce groupe sanguin est enregistré dans votre profil</span>
                </div>
              </div>
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-3xl text-blue-600">bloodtype</span>
              </div>
            </div>
          </div>
        }

        <!-- Recent Requests -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Demandes récentes</h3>
              <button
                (click)="viewAllRequests()"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Voir tout
              </button>
            </div>
            
            @if (recentRequests().length === 0) {
              <div class="text-center py-8">
                <span class="material-symbols-outlined text-4xl text-gray-400">emergency</span>
                <p class="text-gray-500 mt-2">Aucune demande récente</p>
                <button
                  (click)="createNewRequest()"
                  class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Créer une demande
                </button>
              </div>
            } @else {
              <div class="space-y-3">
                @for (demande of recentRequests(); track demande.id) {
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
                          {{ demande.quantiteDemandee }} ml
                        </p>
                        <p class="text-sm text-gray-500">
                          {{ demande.hopitalNom }}
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
          </div>

          <!-- Available Hospitals with Stock -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Stocks disponibles</h3>
              <button
                (click)="viewAllHospitals()"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Voir tout
              </button>
            </div>
            
            @if (hospitalsWithStock().length === 0) {
              <div class="text-center py-8">
                <span class="material-symbols-outlined text-4xl text-gray-400">local_hospital</span>
                <p class="text-gray-500 mt-2">Aucun hôpital avec stock disponible</p>
              </div>
            } @else {
              <div class="space-y-3">
                @for (hospital of hospitalsWithStock().slice(0, 5); track hospital.id) {
                  <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div class="flex justify-between items-center">
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">{{ hospital.nom }}</h4>
                        <p class="text-sm text-gray-500">{{ hospital.ville }}</p>
                        <div class="flex items-center gap-2 mt-2">
                          <div class="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              class="h-2 rounded-full bg-green-500"
                              [style.width]="(hospital.stockActuel / hospital.capaciteStockage * 100) + '%'"
                            ></div>
                          </div>
                          <span class="text-xs text-gray-600">{{ hospital.stockActuel }}L / {{ hospital.capaciteStockage }}L</span>
                        </div>
                      </div>
                      <button
                        (click)="selectHospital(hospital)"
                        class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              (click)="createNewRequest()"
              class="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span class="material-symbols-outlined">add_circle</span>
              <span>Nouvelle demande</span>
            </button>
            <button
              (click)="viewAllHospitals()"
              class="flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span class="material-symbols-outlined">local_hospital</span>
              <span>Consulter les hôpitaux</span>
            </button>
            <button
              (click)="viewProfile()"
              class="flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span class="material-symbols-outlined">person</span>
              <span>Mon profil</span>
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class PatientDashboardComponent implements OnInit {
  currentUser = signal<any>(null);
  demandes = signal<DemandeSangResponse[]>([]);
  hospitals = signal<HopitalResponse[]>([]);
  loading = signal(true);

  recentRequests = computed(() => 
    this.demandes().slice(0, 5).sort((a, b) => 
      new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime()
    )
  );

  hospitalsWithStock = computed(() => 
    this.hospitals().filter(h => h.stockActuel > 0).sort((a, b) => b.stockActuel - a.stockActuel)
  );

  constructor(
    private patientApi: PatientApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load both demands and hospitals in parallel
    Promise.all([
      this.patientApi.getMesDemandes().toPromise(),
      this.patientApi.getHospitals().toPromise()
    ]).then(([demandes, hospitals]) => {
      this.demandes.set(demandes || []);
      this.hospitals.set(hospitals || []);
      this.loading.set(false);
    }).catch(() => {
      this.loading.set(false);
    });
  }

  createNewRequest(): void {
    this.router.navigate(['/patient/hopitaux']);
  }

  viewAllRequests(): void {
    this.router.navigate(['/patient/demandes']);
  }

  viewAllHospitals(): void {
    this.router.navigate(['/patient/hopitaux']);
  }

  viewProfile(): void {
    this.router.navigate(['/patient/profil']);
  }

  selectHospital(hospital: HopitalResponse): void {
    localStorage.setItem('selected_hospital', JSON.stringify(hospital));
    this.router.navigate(['/patient/demandes/form']);
  }
}
