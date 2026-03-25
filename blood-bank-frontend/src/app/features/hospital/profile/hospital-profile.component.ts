import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import type { HopitalResponse } from '../../../core/models/types';

@Component({
  selector: 'app-hospital-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Profil de l'hôpital</h1>
            <p class="text-gray-600 mt-1">Gérez les informations de votre hôpital</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              (click)="editMode.set(!editMode())"
              [class]="editMode() ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'"
              class="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors"
            >
              <span class="material-symbols-outlined">{{ editMode() ? 'cancel' : 'edit' }}</span>
              {{ editMode() ? 'Annuler' : 'Modifier' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Chargement du profil...</p>
        </div>
      } @else {
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-6">
          <!-- Hospital Information -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de l'hôpital</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'hôpital *</label>
                <input
                  type="text"
                  formControlName="nom"
                  [readonly]="!editMode()"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de l'hôpital"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                <input
                  type="text"
                  formControlName="adresse"
                  [readonly]="!editMode()"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                <input
                  type="text"
                  formControlName="ville"
                  [readonly]="!editMode()"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ville"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Région *</label>
                <input
                  type="text"
                  formControlName="region"
                  [readonly]="!editMode()"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Région"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  formControlName="telephone"
                  [readonly]="!editMode()"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Numéro de téléphone"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  formControlName="email"
                  [readonly]="!editMode()"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email de contact"
                />
              </div>
            </div>

            @if (editMode()) {
              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  (click)="editMode.set(false)"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="profileForm.invalid || saving()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  @if (saving()) {
                    <span class="material-symbols-outlined animate-spin">save</span>
                    Enregistrement...
                  } @else {
                    <span class="material-symbols-outlined">save</span>
                    Enregistrer
                  }
                </button>
              </div>
            }
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class HospitalProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = signal(true);
  editMode = signal(false);
  saving = signal(false);

  constructor(
    private fb: FormBuilder,
    private adminApi: AdminApiService,
    private patientApi: PatientApiService
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      region: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    // For now, using mock data - in real app, this would come from auth
    const hospitalId = 1;
    // Using patient API to get hospital info
    this.patientApi.getHospitals().subscribe({
      next: (hospitals: HopitalResponse[]) => {
        const hospital = hospitals.find(h => h.id === hospitalId);
        if (hospital) {
          this.profileForm.patchValue({
            nom: hospital.nom || '',
            adresse: hospital.adresse || '',
            ville: hospital.ville || '',
            region: hospital.region || '',
            telephone: hospital.telephone || '',
            email: hospital.email || ''
          });
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.loading.set(false);
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.saving.set(true);
    const formData = this.profileForm.value;
    
    // For now, using mock hospital ID - in real app, this would come from auth
    const hospitalId = 1;
    // TODO: Implement hospital profile update when API is available
    console.log('Saving hospital profile:', formData);
    
    // Mock save for now
    setTimeout(() => {
      this.saving.set(false);
      this.editMode.set(false);
      alert('Profil mis à jour avec succès!');
    }, 1000);
  }
}
