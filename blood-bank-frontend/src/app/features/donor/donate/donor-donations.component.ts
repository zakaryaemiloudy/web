import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonorApiService } from '../../../core/services/api/donor-api.service';
import { PublicApiService } from '../../../core/services/api/public-api.service';
import type { DonResponse, CampagneResponse, HopitalResponse } from '../../../core/models/types';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

interface LocationOption {
  id: number;
  name: string;
  type: 'hospital' | 'campaign';
  address?: string;
  details?: string;
}

@Component({
  selector: 'app-donor-donations',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, BloodTypeBadgeComponent, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Mes dons</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- New donation form -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Déclarer un don</h3>
          <form [formGroup]="donationForm" (ngSubmit)="submitDonation()" class="space-y-4">
            <!-- Location Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lieu du don *</label>
              <select
                formControlName="lieu"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Sélectionner un lieu...</option>
                @for (location of locationOptions(); track location.id) {
                  <option [value]="location.id">
                    {{ location.name }}
                    @if (location.type === 'hospital') {
                      (Hôpital)
                    } @else {
                      (Campagne)
                    }
                  </option>
                }
              </select>
              @if (donationForm.get('lieu')?.invalid && donationForm.get('lieu')?.touched) {
                <p class="text-xs text-red-600 mt-1">Veuillez sélectionner un lieu de don</p>
              }
            </div>

            <!-- Location Details -->
            @if (selectedLocation(); as location) {
              <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-xs font-medium text-blue-900">{{ location.name }}</p>
                @if (location.address) {
                  <p class="text-xs text-blue-800 mt-1">📍 {{ location.address }}</p>
                }
                @if (location.details) {
                  <p class="text-xs text-blue-800 mt-1">{{ location.details }}</p>
                }
              </div>
            }

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantité (ml) *</label>
              <input
                type="number"
                min="400"
                max="500"
                formControlName="quantiteMl"
                placeholder="450"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Minimum: 400 ml, Maximum: 500 ml</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date du don *</label>
              <input
                type="date"
                formControlName="dateDon"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Remarques</label>
              <textarea
                rows="3"
                formControlName="remarques"
                placeholder="Notes additionnelles..."
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              ></textarea>
            </div>

            <button
              type="submit"
              [disabled]="donationForm.invalid || isSubmitting()"
              class="w-full mt-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting() ? 'Enregistrement...' : 'Enregistrer le don' }}
            </button>
          </form>

          @if (successMessage()) {
            <div class="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
              {{ successMessage() }}
            </div>
          }

          @if (errorMessage()) {
            <div class="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- Donations history -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Historique de mes dons</h3>
              <p class="text-sm text-gray-500 mt-1">{{ donations().length }} don(s) total</p>
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
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Destination</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    @for (don of donations(); track don.id) {
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-3">
                          <app-blood-type-badge [groupeSanguin]="don.groupeSanguin" />
                        </td>
                        <td class="px-6 py-3 text-sm font-semibold text-gray-900">{{ don.quantiteMl }} ml</td>
                        <td class="px-6 py-3 text-sm text-gray-600">{{ don.dateDon | date:'short' }}</td>
                        <td class="px-6 py-3 text-sm text-gray-600">{{ don.campagneTitre || don.hopitalNom || '-' }}</td>
                        <td class="px-6 py-3">
                          <app-status-badge [status]="don.statut" />
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="5" class="px-6 py-8 text-sm text-gray-500 text-center">
                          Aucun don enregistré. Commencez par déclarer votre premier don!
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
export class DonorDonationsComponent implements OnInit {
  donations = signal<DonResponse[]>([]);
  hospitals = signal<HopitalResponse[]>([]);
  campaigns = signal<CampagneResponse[]>([]);
  loading = signal(true);
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  donationForm: FormGroup;

  locationOptions = computed(() => {
    const options: LocationOption[] = [];

    // Add hospitals
    this.hospitals().forEach(hospital => {
      options.push({
        id: hospital.id,
        name: hospital.nom,
        type: 'hospital',
        address: `${hospital.adresse}, ${hospital.ville}`,
      });
    });

    // Add campaigns
    this.campaigns().forEach(campaign => {
      options.push({
        id: campaign.id,
        name: campaign.titre,
        type: 'campaign',
        address: campaign.lieuCollecte,
        details: `${campaign.ville}, ${campaign.region} - ${campaign.dateDebut} à ${campaign.dateFin}`,
      });
    });

    return options;
  });

  selectedLocation = computed(() => {
    const lieuId = this.donationForm.get('lieu')?.value;
    if (!lieuId) return null;
    return this.locationOptions().find(loc => loc.id === parseInt(lieuId));
  });

  constructor(
    private fb: FormBuilder,
    private donorApi: DonorApiService,
    private publicApi: PublicApiService
  ) {
    this.donationForm = this.fb.nonNullable.group({
      lieu: ['', [Validators.required]],
      quantiteMl: [450, [Validators.required, Validators.min(400), Validators.max(500)]],
      dateDon: ['', [Validators.required]],
      remarques: [''],
    });
  }

  ngOnInit(): void {
    this.loadDonations();
    this.loadHospitals();
    this.loadCampaigns();
  }

  private loadDonations(): void {
    this.donorApi.getDonations().subscribe({
      next: (list: DonResponse[]) => {
        this.donations.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Erreur lors du chargement des dons');
      },
    });
  }

  private loadHospitals(): void {
    this.publicApi.getHopitaux().subscribe({
      next: (hospitals: HopitalResponse[]) => {
        // Only show validated hospitals
        this.hospitals.set(hospitals.filter((h: HopitalResponse) => h.statut === 'VALIDE'));
      },
      error: () => {
        console.error('Erreur lors du chargement des hôpitaux');
      },
    });
  }

  private loadCampaigns(): void {
    this.donorApi.getCampagnes().subscribe({
      next: (campaigns) => {
        // Only show active campaigns
        this.campaigns.set(campaigns.filter(c => c.statut === 'EN_COURS'));
      },
      error: () => {
        console.error('Erreur lors du chargement des campagnes');
      },
    });
  }

  submitDonation(): void {
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const formValue = this.donationForm.getRawValue();
    const lieuValue = this.donationForm.get('lieu')?.value;

    // Find the selected location directly
    let hopitalId: number | undefined;
    let campagneId: number | undefined;

    // Search by exact ID in locationOptions
    const selectedLocation = this.locationOptions().find(loc => {
      // Handle both string and number comparisons
      if (typeof loc.id === 'number' && typeof lieuValue === 'string') {
        return loc.id === parseInt(lieuValue, 10);
      }
      return loc.id === lieuValue;
    });

    if (!selectedLocation) {
      this.errorMessage.set('Veuillez sélectionner un lieu de don valide');
      this.isSubmitting.set(false);
      return;
    }

    // Set appropriate ID based on type
    if (selectedLocation.type === 'hospital') {
      hopitalId = selectedLocation.id as number;
    } else if (selectedLocation.type === 'campaign') {
      campagneId = selectedLocation.id as number;
    }

    // Prepare donation data - ensure at least one ID is set
    const donationData: any = {
      quantiteMl: formValue.quantiteMl,
      notes: formValue.remarques,
    };

    // Only include the IDs that are actually set
    if (hopitalId !== undefined) {
      donationData.hopitalId = hopitalId;
    }
    if (campagneId !== undefined) {
      donationData.campagneId = campagneId;
    }

    // Include date if provided
    if (formValue.dateDon) {
      donationData.dateDon = new Date(formValue.dateDon).toISOString();
    }

    this.donorApi.submitDonation(donationData).subscribe({
      next: (newDon: DonResponse) => {
        this.donations.update((list) => [newDon, ...list]);
        this.donationForm.reset({
          lieu: '',
          quantiteMl: 450,
          dateDon: '',
          remarques: '',
        });
        this.successMessage.set('Don enregistré avec succès!');
        setTimeout(() => this.successMessage.set(null), 3000);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err?.error?.message ??
          'Erreur lors de l\'enregistrement du don'
        );
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }
}
