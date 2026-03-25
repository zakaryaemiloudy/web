import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonorApiService } from '../../../core/services/api/donor-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import type { DonneurResponse } from '../../../core/models/types';

@Component({
  selector: 'app-donor-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Mon profil donneur</h2>

      @if (loading()) {
        <p class="text-gray-500">Chargement du profil...</p>
      } @else if (currentUser(); as user) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile card -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span class="material-symbols-outlined text-3xl text-red-600">person</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">{{ user.prenom }} {{ user.nom }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ user.email }}</p>

                <!-- Blood type badge -->
                @if (donor(); as d) {
                  <div class="mt-4 w-full">
                    <span class="inline-block px-4 py-2 rounded-lg bg-red-100 text-red-800 text-sm font-medium">
                      Groupe {{ d.groupeSanguin }}
                    </span>
                  </div>
                }

                <!-- Role Toggle -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Rôles actifs</h4>
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
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
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
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
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
              @if (donor(); as d) {
                <div class="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Dons totaux</span>
                    <span class="text-lg font-semibold text-gray-900">{{ d.nombreDonsTotal }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Points</span>
                    <span class="text-lg font-semibold text-red-600">{{ d.pointsTotal }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Dernier don</span>
                    <span class="text-sm text-gray-900">
                      {{ d.dateDernierDon ? (d.dateDernierDon | date:'short') : 'Jamais' }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Edit form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      formControlName="prenom"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      formControlName="nom"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    formControlName="email"
                    [disabled]="true"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-600"
                  />
                  <p class="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    formControlName="telephone"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <input
                      type="date"
                      formControlName="dateNaissance"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin</label>
                    <select
                      formControlName="groupeSanguin"
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
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <textarea
                    formControlName="adresse"
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div class="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    (click)="resetForm()"
                    class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    [disabled]="profileForm.invalid || isUpdating()"
                    class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {{ isUpdating() ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                  </button>
                </div>
              </form>

              @if (updateMessage()) {
                <div class="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                  {{ updateMessage() }}
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DonorProfileComponent implements OnInit {
  currentUser = signal<any>(null);
  donor = signal<DonneurResponse | null>(null);
  loading = signal(true);
  isUpdating = signal(false);
  updateMessage = signal<string | null>(null);
  roleToggleMessage = signal<string | null>(null);
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private donorApi: DonorApiService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.nonNullable.group({
      prenom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      telephone: [''],
      dateNaissance: [''],
      groupeSanguin: [''],
      adresse: [''],
    });
  }

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    this.loadDonorProfile();
  }

  private loadDonorProfile(): void {
    this.donorApi.getProfile().subscribe({
      next: (profile) => {
        this.donor.set(profile);
        this.initializeForm(profile);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private initializeForm(donor: DonneurResponse): void {
    this.profileForm.patchValue({
      prenom: donor.prenom || '',
      nom: donor.nom || '',
      email: donor.email || '',
      telephone: donor.telephone || '',
      dateNaissance: donor.dateNaissance || '',
      groupeSanguin: donor.groupeSanguin || '',
      adresse: donor.adresse || '',
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isUpdating.set(true);
    const formValue = this.profileForm.getRawValue();

    this.donorApi.updateProfile(formValue).subscribe({
      next: (updated: DonneurResponse) => {
        this.donor.set(updated);
        this.updateMessage.set('Profil mis à jour avec succès!');
        setTimeout(() => this.updateMessage.set(null), 3000);
        this.isUpdating.set(false);
      },
      error: () => {
        this.isUpdating.set(false);
      },
    });
  }

  resetForm(): void {
    if (this.donor()) {
      this.initializeForm(this.donor()!);
    }
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
    this.donorApi.toggleRole({
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
    this.donorApi.toggleRole({
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
