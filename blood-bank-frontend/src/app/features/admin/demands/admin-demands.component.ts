import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { DemandeSangResponse, StatutDemande } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { bloodGroupLabel } from '../../../shared/utils/blood-type';
import { AdminCandidaturesComponent } from '../candidatures/admin-candidatures.component';

type FilterTab = 'all' | 'urgent' | 'encours';

@Component({
  selector: 'app-admin-demands',
  standalone: true,
  imports: [CommonModule, DatePipe, StatusBadgeComponent, BloodTypeBadgeComponent, FormsModule, ReactiveFormsModule, AdminCandidaturesComponent],
  templateUrl: './admin-demands.component.html',
})
export class AdminDemandsComponent implements OnInit {
  demandes = signal<DemandeSangResponse[]>([]);
  loading = signal(true);
  activeTab = signal<FilterTab>('all');
  showCreateForm = signal(false);
  createForm!: FormGroup;
  submitting = signal(false);
  selectedDemandeId = signal<number | null>(null);
  showCandidaturesModal = signal(false);

  bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  urgences = ['BASSE', 'NORMALE', 'HAUTE', 'CRITIQUE'];

  constructor(private adminApi: AdminApiService, private fb: FormBuilder) {
    this.initForm();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      groupeSanguinDemande: ['', Validators.required],
      quantiteDemandee: ['', [Validators.required, Validators.min(50)]],
      urgence: ['NORMALE', Validators.required],
      nomPatient: ['', Validators.required],
      prenomPatient: ['', Validators.required],
      diagnostic: ['', Validators.required],
      medecinPrescripteur: ['', Validators.required],
      dateBesoin: ['', Validators.required],
      notes: [''],
    });
  }

  filteredDemandes = computed(() => {
    const list = this.demandes();
    const tab = this.activeTab();
    if (tab === 'urgent') return list.filter((d) => d.urgence === 'CRITIQUE' || d.urgence === 'HAUTE');
    if (tab === 'encours') return list.filter((d) => d.statut === 'EN_COURS' || d.statut === 'EN_ATTENTE');
    return list;
  });

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.adminApi.getDemandes().subscribe({
      next: (list) => this.demandes.set(list),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  setTab(t: FilterTab): void {
    this.activeTab.set(t);
  }

  urgencyBorderClass(urgence: string): string {
    if (urgence === 'CRITIQUE') return 'border-l-red-500';
    if (urgence === 'HAUTE') return 'border-l-orange-500';
    return 'border-l-sky-500';
  }

  traiter(id: number, statut: StatutDemande): void {
    this.adminApi.traiterDemande(id, statut).subscribe({
      next: (updated) => {
        this.demandes.update((list) =>
          list.map((d) => (d.id === updated.id ? updated : d))
        );
      },
      error: () => {},
    });
  }

  openCreateForm(): void {
    this.showCreateForm.set(true);
  }

  closeCreateForm(): void {
    this.showCreateForm.set(false);
    this.initForm();
  }

  submitForm(): void {
    if (!this.createForm.valid) return;

    this.submitting.set(true);
    this.adminApi.creerDemande(this.createForm.value).subscribe({
      next: (demande: DemandeSangResponse) => {
        this.demandes.update((list) => [...list, demande]);
        this.closeCreateForm();
        this.submitting.set(false);
        alert('Demande créée avec succès!');
      },
      error: (err) => {
        this.submitting.set(false);
        const errorMsg = err.error?.message || err.statusText || 'Erreur lors de la création de la demande';
        console.error('Error creating demand:', err);
        alert(errorMsg);
      },
    });
  }

  openCandidatures(demandeId: number): void {
    this.selectedDemandeId.set(demandeId);
    this.showCandidaturesModal.set(true);
  }

  closeCandidatures(): void {
    this.showCandidaturesModal.set(false);
    this.selectedDemandeId.set(null);
  }

  bloodLabel = bloodGroupLabel;
}
