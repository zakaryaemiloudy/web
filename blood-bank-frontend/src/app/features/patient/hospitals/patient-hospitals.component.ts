import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-patient-hospitals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Hôpitaux disponibles</h1>
        <p class="text-gray-600 mt-2">
          Sélectionnez un hôpital pour consulter les stocks de sang et créer une demande.
        </p>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-gray-400 animate-spin">refresh</span>
          <p class="text-gray-500 mt-4">Chargement des hôpitaux...</p>
        </div>
      } @else if (hospitals().length === 0) {
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-gray-400">local_hospital</span>
          <p class="text-gray-500 mt-4">Aucun hôpital disponible</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (hospital of hospitals(); track hospital.id) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl text-blue-600">local_hospital</span>
                </div>
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {{ hospital.statut }}
                </span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ hospital.nom }}</h3>
              
              <div class="space-y-2 text-sm text-gray-600 mb-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">location_on</span>
                  <span>{{ hospital.adresse }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">phone</span>
                  <span>{{ hospital.telephone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">apartment</span>
                  <span>{{ hospital.ville }}</span>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Capacité</span>
                  <span class="font-medium">{{ hospital.capacite }} l</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Stock actuel</span>
                  <span class="font-medium">{{ hospital.stockActuel || 0 }} l</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-gray-200">
                <button
                  (click)="selectHospital(hospital)"
                  class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sélectionner cet hôpital
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PatientHospitalsComponent implements OnInit {
  hospitals = signal<any[]>([]);
  loading = signal(true);
  currentUser = signal<any>(null);

  constructor(
    private patientApi: PatientApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    this.loadHospitals();
  }

  private loadHospitals(): void {
    this.patientApi.getHospitals().subscribe({
      next: (hospitals) => {
        this.hospitals.set(hospitals);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        // Fallback to mock data if API fails
        this.hospitals.set([
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
          }
        ]);
      }
    });
  }

  selectHospital(hospital: any): void {
    // Save selected hospital to localStorage for use in demande form
    localStorage.setItem('selected_hospital', JSON.stringify(hospital));
    this.router.navigate(['/patient/demandes/form']);
  }
}
