import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientApiService } from '../../../core/services/api/patient-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import type { DemandeSangRequest, GroupeSanguin } from '../../../core/models/types';

@Component({
  selector: 'app-patient-demande-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Créer une demande de sang</h2>
          <p class="text-gray-600 mt-2">
            Remplissez ce formulaire pour créer une demande de sang auprès de l'hôpital sélectionné.
          </p>
        </div>

        @if (selectedHospital()) {
          <div class="p-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 class="font-medium text-blue-900 mb-2">Hôpital sélectionné</h3>
              <p class="text-blue-800 font-medium">{{ selectedHospital().nom }}</p>
              <p class="text-blue-600 text-sm">{{ selectedHospital().adresse }}</p>
              <p class="text-blue-600 text-sm">{{ selectedHospital().telephone }}</p>
            </div>

            <form [formGroup]="demandeForm" (ngSubmit)="submitDemande()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Blood Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Groupe sanguin requis</label>
                  <select
                    formControlName="groupeSanguinDemande"
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

                <!-- Quantity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Quantité (ml)</label>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    formControlName="quantiteDemandee"
                    placeholder="500"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Urgency -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Urgence</label>
                  <select
                    formControlName="urgence"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner l'urgence</option>
                    <option value="BASSE">Basse</option>
                    <option value="NORMALE">Normale</option>
                    <option value="HAUTE">Haute</option>
                    <option value="CRITIQUE">Critique</option>
                  </select>
                </div>

                <!-- Patient Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet du patient</label>
                  <input
                    type="text"
                    formControlName="nomPatient"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prénom du patient</label>
                  <input
                    type="text"
                    formControlName="prenomPatient"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                </div>

                <!-- Diagnostic -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Diagnostic médical</label>
                  <textarea
                    rows="3"
                    formControlName="diagnostic"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description du diagnostic..."
                  ></textarea>
                </div>

                <!-- Date Needed -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date de besoin</label>
                  <input
                    type="date"
                    formControlName="dateBesoin"
                    class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Médecin prescripteur</label>
                <input
                  type="text"
                  formControlName="medecinPrescripteur"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du médecin qui prescrit cette demande..."
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes additionnelles</label>
                <textarea
                  formControlName="notes"
                  rows="3"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Informations complémentaires..."
                ></textarea>
              </div>

              @if (stockWarning()) {
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-yellow-600 text-xl">warning</span>
                    <div>
                      <h4 class="font-medium text-yellow-800">Attention - Stock limité</h4>
                      <p class="text-yellow-700 text-sm mt-1">{{ stockWarning() }}</p>
                    </div>
                  </div>
                </div>
              }

              <div class="flex gap-3 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  (click)="cancel()"
                  class="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="demandeForm.invalid || isSubmitting()"
                  class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ isSubmitting() ? 'Création en cours...' : 'Créer la demande' }}
                </button>
              </div>
            </div>
            </form>
          </div>
        } @else {
          <div class="p-6 text-center">
            <span class="material-symbols-outlined text-4xl text-gray-400">local_hospital</span>
            <p class="text-gray-500 mt-2">Veuillez d'abord sélectionner un hôpital</p>
            <button
              (click)="goToHospitalSelection()"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sélectionner un hôpital
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class PatientDemandeFormComponent implements OnInit {
  currentUser = signal<any>(null);
  selectedHospital = signal<any>(null);
  stockLevels = signal<any[]>([]);
  demandeForm: FormGroup;
  isSubmitting = signal(false);
  stockWarning = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private patientApi: PatientApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.demandeForm = this.fb.group({
      groupeSanguinDemande: ['', Validators.required],
      quantiteDemandee: [450, [Validators.required, Validators.min(100), Validators.max(2000)]],
      urgence: ['NORMALE', Validators.required],
      nomPatient: ['', Validators.required],
      prenomPatient: ['', Validators.required],
      diagnostic: ['', Validators.required],
      medecinPrescripteur: ['', Validators.required],
      dateBesoin: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    
    // Get selected hospital from localStorage or route params
    const savedHospital = localStorage.getItem('selected_hospital');
    if (savedHospital) {
      this.selectedHospital.set(JSON.parse(savedHospital));
      this.loadStockLevels();
    }
  }

  private loadStockLevels(): void {
    if (!this.selectedHospital()) return;
    
    this.patientApi.getStocks(this.selectedHospital().id).subscribe({
      next: (stocks) => {
        this.stockLevels.set(stocks);
        this.checkStockAvailability();
      }
    });
  }

  private checkStockAvailability(): void {
    const currentUser = this.currentUser();
    if (!currentUser || !currentUser.groupeSanguin) return;

    const bloodTypeStock = this.stockLevels().find(stock => 
      stock.groupeSanguin === currentUser.groupeSanguin
    );

    if (bloodTypeStock && bloodTypeStock.quantite < 100) {
      this.stockWarning.set(
        `Cet hôpital n'a que ${bloodTypeStock.quantite} ml de sang de type ${currentUser.groupeSanguin} en stock. La demande sera créée mais l'hôpital devra contacter des donneurs.`
      );
    } else {
      this.stockWarning.set(null);
    }
  }

  submitDemande(): void {
    if (this.demandeForm.invalid || !this.selectedHospital()) return;

    this.isSubmitting.set(true);

    const currentUser = this.currentUser();
    if (!currentUser) return;

    const demandeData: DemandeSangRequest = {
      ...this.demandeForm.value,
      hopitalId: this.selectedHospital().id,
      nomPatient: `${currentUser.prenom} ${currentUser.nom}`,
      prenomPatient: currentUser.prenom
    };

    this.patientApi.createDemande(demandeData).subscribe({
      next: () => {
        this.router.navigate(['/patient/demandes']);
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Erreur lors de la création de la demande');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/patient/hopitaux']);
  }

  goToHospitalSelection(): void {
    this.router.navigate(['/patient/hopitaux']);
  }
}
