import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { HopitalResponse, UtilisateurResponse } from '../../../core/models/types';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Gestion des administrateurs</h2>
            <p class="text-gray-600 mt-1">Ajoutez et gérez les administrateurs d'hôpitaux</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-500">
              Total: <span class="font-semibold text-gray-900">{{ admins().length }}</span> admins
            </div>
            <button
              type="button"
              (click)="showAddAdminModal.set(true)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined">add</span>
              Ajouter un admin
            </button>
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
          <p class="text-gray-600 mt-4">Chargement des administrateurs...</p>
        </div>
      } @else if (filteredAdmins().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <span class="material-symbols-outlined text-4xl text-gray-400">admin_panel_settings</span>
          <p class="text-gray-600 mt-4">Aucun administrateur trouvé</p>
        </div>
      } @else {
        <!-- Admins List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hôpital</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (admin of filteredAdmins(); track admin.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span class="material-symbols-outlined text-blue-600 text-sm">person</span>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ admin.nom }} {{ admin.prenom }}
                          </div>
                          <div class="text-xs text-gray-500">ID: {{ admin.id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ admin.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (admin.hopitalNom) {
                        <div class="text-sm text-gray-900">{{ admin.hopitalNom }}</div>
                      } @else {
                        <div class="text-sm text-gray-400">Non assigné</div>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {{ admin.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        [class]="admin.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ admin.actif ? 'Actif' : 'Inactif' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center gap-2">
                        <button
                          (click)="editAdmin(admin)"
                          class="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          title="Modifier"
                        >
                          <span class="material-symbols-outlined text-sm">edit</span>
                        </button>
                        @if (admin.actif) {
                          <button
                            (click)="toggleAdminStatus(admin, false)"
                            class="p-1.5 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Désactiver"
                          >
                            <span class="material-symbols-outlined text-sm">block</span>
                          </button>
                        } @else {
                          <button
                            (click)="toggleAdminStatus(admin, true)"
                            class="p-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                            title="Activer"
                          >
                            <span class="material-symbols-outlined text-sm">check_circle</span>
                          </button>
                        }
                        <button
                          (click)="deleteAdmin(admin)"
                          class="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>

    <!-- Add/Edit Admin Modal -->
    @if (showAddAdminModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ editingAdmin() ? 'Modifier un administrateur' : 'Ajouter un administrateur' }}
              </h3>
              <button
                (click)="closeModal()"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          
          <div class="p-6 space-y-6">
            <form [formGroup]="adminForm" (ngSubmit)="submitAdmin()">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    formControlName="nom"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de l'administrateur"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    formControlName="prenom"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Prénom de l'administrateur"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    formControlName="email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@exemple.com"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                  <input
                    formControlName="motDePasse"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mot de passe temporaire"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    formControlName="telephone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+212 6 12 34 56"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hôpital *</label>
                  <select
                    formControlName="hopitalId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un hôpital</option>
                    @for (hospital of hospitals(); track hospital.id) {
                      <option [value]="hospital.id">{{ hospital.nom }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="!adminForm.valid || submitting()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (submitting()) {
                    <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    {{ editingAdmin() ? 'Modification...' : 'Création...' }}
                  } @else {
                    {{ editingAdmin() ? 'Modifier' : 'Créer' }} l'administrateur
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class AdminManagementComponent implements OnInit {
  admins = signal<UtilisateurResponse[]>([]);
  hospitals = signal<HopitalResponse[]>([]);
  loading = signal(true);
  activeTab = signal<'all' | 'active' | 'inactive'>('all');
  showAddAdminModal = signal(false);
  editingAdmin = signal<UtilisateurResponse | null>(null);
  submitting = signal(false);
  adminForm: FormGroup;

  filterTabs = signal<{ value: 'all' | 'active' | 'inactive'; label: string; count: number }[]>([
    { value: 'all', label: 'Tous', count: 0 },
    { value: 'active', label: 'Actifs', count: 0 },
    { value: 'inactive', label: 'Inactifs', count: 0 }
  ]);

  constructor(
    private superAdminApi: SuperAdminApiService,
    private adminApi: AdminApiService,
    private fb: FormBuilder
  ) {
    this.adminForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]],
      telephone: [''],
      hopitalId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadAdmins();
    this.loadHospitals();
  }

  private loadAdmins(): void {
    this.loading.set(true);
    
    // Since there's no admin management API yet, create mock data
    // In a real implementation, this would call a proper admin management endpoint
    const mockAdmins: UtilisateurResponse[] = [
      {
        id: 1,
        email: 'admin.hopital1@lifeflow.com',
        nom: 'Administrateur',
        prenom: 'Hôpital 1',
        telephone: '+212 6 12 34 56',
        role: 'ADMIN',
        hopitalId: 1,
        hopitalNom: 'Hôpital Principal',
        actif: true,
        dateCreation: '2024-01-15',
        derniereConnexion: '2024-03-26',
        pointsTotal: 0
      },
      {
        id: 2,
        email: 'admin.hopital2@lifeflow.com',
        nom: 'Administrateur',
        prenom: 'Hôpital 2',
        telephone: '+212 6 12 34 57',
        role: 'ADMIN',
        hopitalId: 2,
        hopitalNom: 'Centre Médical Nord',
        actif: true,
        dateCreation: '2024-02-20',
        derniereConnexion: '2024-03-25',
        pointsTotal: 0
      },
      {
        id: 3,
        email: 'admin.inactive@lifeflow.com',
        nom: 'Ancien',
        prenom: 'Administrateur',
        telephone: '+212 6 12 34 58',
        role: 'ADMIN',
        hopitalId: undefined,
        hopitalNom: undefined,
        actif: false,
        dateCreation: '2023-12-10',
        derniereConnexion: '2024-01-15',
        pointsTotal: 0
      }
    ];
    
    this.admins.set(mockAdmins);
    this.updateFilterCounts();
    this.loading.set(false);
    
    // In a real implementation, you would call:
    // this.superAdminApi.getAdmins().subscribe({
    //   next: (admins) => {
    //     this.admins.set(admins);
    //     this.updateFilterCounts();
    //     this.loading.set(false);
    //   },
    //   error: (error) => {
    //     console.error('Error loading admins:', error);
    //     this.loading.set(false);
    //   }
    // });
  }

  private loadHospitals(): void {
    this.superAdminApi.getHopitaux().subscribe({
      next: (hospitals) => {
        this.hospitals.set(hospitals);
      },
      error: (error) => {
        console.error('Error loading hospitals:', error);
      }
    });
  }

  private updateFilterCounts(): void {
    const all = this.admins();
    this.filterTabs.set([
      { value: 'all', label: 'Tous', count: all.length },
      { value: 'active', label: 'Actifs', count: all.filter(a => a.actif).length },
      { value: 'inactive', label: 'Inactifs', count: all.filter(a => !a.actif).length }
    ]);
  }

  filteredAdmins = computed(() => {
    const all = this.admins();
    const tab = this.activeTab();
    
    switch (tab) {
      case 'active':
        return all.filter(a => a.actif);
      case 'inactive':
        return all.filter(a => !a.actif);
      default:
        return all;
    }
  });

  editAdmin(admin: UtilisateurResponse): void {
    this.editingAdmin.set(admin);
    this.adminForm.patchValue({
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      telephone: admin.telephone,
      hopitalId: admin.hopitalId || null
    });
    this.showAddAdminModal.set(true);
  }

  closeModal(): void {
    this.showAddAdminModal.set(false);
    this.editingAdmin.set(null);
    this.adminForm.reset();
  }

  submitAdmin(): void {
    if (!this.adminForm.valid) return;

    this.submitting.set(true);
    const formData = this.adminForm.value;

    if (this.editingAdmin()) {
      // Update existing admin
      // This would need to be implemented in the backend
      console.log('Update admin:', { ...formData, id: this.editingAdmin()!.id });
      
      setTimeout(() => {
        this.submitting.set(false);
        this.closeModal();
        alert('Administrateur modifié avec succès!');
      }, 1500);
    } else {
      // Create new admin
      const adminData = {
        email: formData.email,
        motDePasse: formData.motDePasse,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        role: 'ADMIN',
        hopitalId: formData.hopitalId
      };

      // This would need to be implemented in the backend
      console.log('Create admin:', adminData);
      
      setTimeout(() => {
        this.submitting.set(false);
        this.closeModal();
        alert('Administrateur créé avec succès!');
        this.loadAdmins(); // Reload the list
      }, 1500);
    }
  }

  toggleAdminStatus(admin: UtilisateurResponse, newStatus: boolean): void {
    const updatedAdmin = { ...admin, actif: newStatus };
    
    // Update local state
    this.admins.update(list => 
      list.map(a => a.id === admin.id ? updatedAdmin : a)
    );
    
    // This would need to be implemented in the backend
    console.log('Toggle admin status:', { id: admin.id, actif: newStatus });
    alert(`Administrateur ${newStatus ? 'activé' : 'désactivé'} avec succès!`);
  }

  deleteAdmin(admin: UtilisateurResponse): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'administrateur ${admin.nom} ${admin.prenom}?`)) {
      return;
    }

    // This would need to be implemented in the backend
    console.log('Delete admin:', admin.id);
    
    // Update local state
    this.admins.update(list => list.filter(a => a.id !== admin.id));
    this.updateFilterCounts();
    
    alert('Administrateur supprimé avec succès!');
  }
}
