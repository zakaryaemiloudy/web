import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { AdminDonationsComponent } from './features/admin/donations/admin-donations.component';
import { AdminDemandsComponent } from './features/admin/demands/admin-demands.component';
import { AdminStocksComponent } from './features/admin/stocks/admin-stocks.component';
import { AdminDonorsComponent } from './features/admin/donors/admin-donors.component';
import { AdminCampaignsComponent } from './features/admin/campaigns/admin-campaigns.component';
import { SuperAdminDashboardComponent } from './features/super-admin/dashboard/super-admin-dashboard.component';
import { HospitalsComponent } from './features/super-admin/hospitals/hospitals.component';
import { GlobalStatsComponent } from './features/super-admin/stats/global-stats.component';
import { NationalCampaignsComponent } from './features/super-admin/campaigns/national-campaigns.component';
import { GlobalNotificationsComponent } from './features/super-admin/notifications/global-notifications.component';
import { DonorProfileComponent } from './features/donor/profile/donor-profile.component';
import { DonorDonationsComponent } from './features/donor/donate/donor-donations.component';
import { LeaderboardComponent } from './features/donor/leaderboard/leaderboard.component';
import { DonorCampaignsComponent } from './features/donor/campaigns/donor-campaigns.component';
import { DonorBloodRequestsComponent } from './features/donor/blood-requests/donor-blood-requests.component';
import { PatientDashboardComponent } from './features/patient/dashboard/patient-dashboard.component';
import { PatientDemandsComponent } from './features/patient/demands/patient-demands.component';
import { DemandDetailComponent } from './features/patient/demands/demand-detail.component';
import { PatientProfileComponent } from './features/patient/profile/patient-profile.component';
import { PatientHospitalsComponent } from './features/patient/hospitals/patient-hospitals.component';
import { PatientDemandeFormComponent } from './features/patient/demande-form/patient-demande-form.component';
import { HospitalDemandsComponent } from './features/hospital/demands/hospital-demands.component';
import { HospitalStocksComponent } from './features/hospital/stocks/hospital-stocks.component';
import { HospitalProfileComponent } from './features/hospital/profile/hospital-profile.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ChatbotComponent } from './features/chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'dons', component: AdminDonationsComponent },
      { path: 'demandes', component: AdminDemandsComponent },
      { path: 'stocks', component: AdminStocksComponent },
      { path: 'donneurs', component: AdminDonorsComponent },
      { path: 'campagnes', component: AdminCampaignsComponent },
    ],
  },
  {
    path: 'superadmin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SuperAdminDashboardComponent },
      { path: 'hopitaux', component: HospitalsComponent },
      { path: 'stats', component: GlobalStatsComponent },
      { path: 'campagnes', component: NationalCampaignsComponent },
      { path: 'notifications', component: GlobalNotificationsComponent },
    ],
  },
  {
    path: 'donneur',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'profil', pathMatch: 'full' },
      { path: 'profil', component: DonorProfileComponent },
      { path: 'dons', component: DonorDonationsComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'campagnes', component: DonorCampaignsComponent },
      { path: 'demandes', component: DonorBloodRequestsComponent },
    ],
  },
  {
    path: 'patient',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: PatientDashboardComponent },
      { path: 'profil', component: PatientProfileComponent },
      { path: 'demandes', component: PatientDemandsComponent },
      { path: 'demandes/:id', component: DemandDetailComponent },
      { path: 'demandes/form', component: PatientDemandeFormComponent },
      { path: 'hopitaux', component: PatientHospitalsComponent },
    ],
  },
  {
    path: 'hospital',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['HOSPITAL', 'ADMIN', 'SUPER_ADMIN'] },
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'demandes', pathMatch: 'full' },
      { path: 'demandes', component: HospitalDemandsComponent },
      { path: 'stocks', component: HospitalStocksComponent },
      { path: 'profile', component: HospitalProfileComponent },
    ],
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [{ path: '', component: NotificationsComponent }],
  },
  {
    path: 'chatbot',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [{ path: '', component: ChatbotComponent }],
  },
];
