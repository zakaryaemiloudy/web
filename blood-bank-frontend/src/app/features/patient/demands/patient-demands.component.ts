import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import type { DemandeSangResponse, GroupeSanguin, HopitalResponse } from '../../../core/models/types';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-patient-demands',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, BloodTypeBadgeComponent, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Mes demandes de sang</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- New demand form -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Nouvelle demande</h3>
          <form [formGroup]="demandForm" (ngSubmit)="submitDemand()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin demandé *</label>
              <select
                formControlName="groupeSanguinDemande"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantité (ml) *</label>
              <input
                type="number"
                min="100"
                max="5000"
                formControlName="quantiteDemandee"
                placeholder="500"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Urgence *</label>
              <select
                formControlName="urgence"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Sélectionner urgence</option>
                <option value="BASSE">Basse</option>
                <option value="NORMALE">Normale</option>
                <option value="HAUTE">Haute</option>
                <option value="CRITIQUE">Critique</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input
                type="text"
                formControlName="nomPatient"
                readonly
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                formControlName="prenomPatient"
                readonly
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Diagnostic médical *</label>
              <textarea
                rows="3"
                formControlName="diagnostic"
                placeholder="Description du diagnostic..."
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hôpital *</label>
              <select
                formControlName="hopitalId"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Sélectionner un hôpital</option>
                @for (hospital of hospitals(); track hospital.id) {
                  <option [value]="hospital.id">{{ hospital.nom }} - {{ hospital.ville }}</option>
                }
              </select>
            </div>

            <button
              type="submit"
              [disabled]="demandForm.invalid || isSubmitting()"
              class="w-full mt-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting() ? 'Envoi...' : 'Soumettre la demande' }}
            </button>
          </form>

          @if (successMessage()) {
            <div class="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
              {{ successMessage() }}
            </div>
          }
        </div>

        <!-- Demands history -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Mes demandes</h3>
                <p class="text-sm text-gray-500 mt-1">{{ demands().length }} demande(s) total</p>
              </div>
            </div>

            @if (loading()) {
              <p class="px-6 py-4 text-gray-500">Chargement...</p>
            } @else {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Groupe</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Quantité</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Urgence</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    @for (demand of demands(); track demand.id) {
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-3">
                          <app-blood-type-badge [groupeSanguin]="demand.groupeSanguinDemande" />
                        </td>
                        <td class="px-6 py-3 text-sm font-semibold text-gray-900">{{ demand.quantiteDemandee }} ml</td>
                        <td class="px-6 py-3">
                          <span
                            class="px-2 py-1 rounded text-xs font-medium"
                            [class.bg-red-100]="demand.urgence === 'CRITIQUE'"
                            [class.text-red-800]="demand.urgence === 'CRITIQUE'"
                            [class.bg-orange-100]="demand.urgence === 'HAUTE'"
                            [class.text-orange-800]="demand.urgence === 'HAUTE'"
                            [class.bg-yellow-100]="demand.urgence === 'NORMALE'"
                            [class.text-yellow-800]="demand.urgence === 'NORMALE'"
                            [class.bg-green-100]="demand.urgence === 'BASSE'"
                            [class.text-green-800]="demand.urgence === 'BASSE'"
                          >
                            {{ demand.urgence }}
                          </span>
                        </td>
                        <td class="px-6 py-3 text-sm text-gray-600">{{ demand.dateDemande | date:'short' }}</td>
                        <td class="px-6 py-3">
                          <app-status-badge [status]="demand.statut" />
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="5" class="px-6 py-8 text-sm text-gray-500 text-center">
                          Aucune demande enregistrée. Soumettez votre première demande!
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PatientDemandsComponent implements OnInit {
  demands = signal<DemandeSangResponse[]>([]);
  loading = signal(true);
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  hospitals = signal<HopitalResponse[]>([]);
  demandForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientApi: PatientApiService,
    private authService: AuthService
  ) {
    this.demandForm = this.fb.nonNullable.group({
      groupeSanguinDemande: ['', [Validators.required]],
      quantiteDemandee: [500, [Validators.required, Validators.min(100), Validators.max(5000)]],
      urgence: ['NORMALE', [Validators.required]],
      nomPatient: ['', [Validators.required]],
      prenomPatient: ['', [Validators.required]],
      diagnostic: ['', [Validators.required]],
      hopitalId: ['', [Validators.required]],
      dateBesoin: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadDemands();
    this.loadHospitals();
    this.loadUserData();
  }

  private loadHospitals(): void {
    this.patientApi.getHospitals().subscribe({
      next: (hospitals) => {
        this.hospitals.set(hospitals);
      },
      error: () => {
        console.error('Error loading hospitals');
      }
    });
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.demandForm.patchValue({
        nomPatient: currentUser.nom || '',
        prenomPatient: currentUser.prenom || ''
      });
    }
  }

  private loadDemands(): void {
    this.patientApi.getMesDemandes().subscribe({
      next: (list) => {
        this.demands.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submitDemand(): void {
    if (this.demandForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.demandForm.getRawValue();
    const currentUser = this.authService.getCurrentUser();
    
    console.log('Form value:', formValue);
    console.log('Current user:', currentUser);
    
    // Convert hopitalId to number if it's a string
    const requestData = {
      ...formValue,
      hopitalId: Number(formValue.hopitalId)
    };
    console.log('Request data:', requestData);

    this.patientApi.createDemande(requestData).subscribe({
      next: (newDemand) => {
        this.demands.update((list) => [newDemand, ...list]);
        this.demandForm.reset({
          groupeSanguinDemande: '',
          quantiteDemandee: 500,
          urgence: 'NORMALE',
          nomPatient: currentUser?.nom || '',
          prenomPatient: currentUser?.prenom || '',
          diagnostic: '',
          hopitalId: '',
          dateBesoin: '',
          notes: ''
        });
        this.successMessage.set('Demande soumise avec succès!');
        setTimeout(() => this.successMessage.set(null), 3000);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error creating demande:', error);
        this.isSubmitting.set(false);
        alert('Erreur lors de la création de la demande. Veuillez réessayer.');
      },
    });
  }
}
