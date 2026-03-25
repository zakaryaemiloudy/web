import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import type { Role } from '../../../core/models/types';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  currentUser: any;
  role: any;

  adminNav: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', roles: ['ADMIN'] },
    { label: 'Donations', path: '/admin/dons', icon: 'volunteer_activism', roles: ['ADMIN'] },
    { label: 'Demandes', path: '/admin/demandes', icon: 'emergency', roles: ['ADMIN'] },
    { label: 'Stocks', path: '/admin/stocks', icon: 'bloodtype', roles: ['ADMIN'] },
    { label: 'Donneurs', path: '/admin/donneurs', icon: 'people', roles: ['ADMIN'] },
    { label: 'Campagnes', path: '/admin/campagnes', icon: 'campaign', roles: ['ADMIN'] },
    { label: 'Hospital View', path: '/hospital/demandes', icon: 'local_hospital', roles: ['ADMIN'] },
  ];

  superAdminNav: NavItem[] = [
    { label: 'Dashboard', path: '/superadmin/dashboard', icon: 'dashboard', roles: ['SUPER_ADMIN'] },
    { label: 'Hôpitaux', path: '/superadmin/hopitaux', icon: 'local_hospital', roles: ['SUPER_ADMIN'] },
    { label: 'Stats', path: '/superadmin/stats', icon: 'bar_chart', roles: ['SUPER_ADMIN'] },
    { label: 'Campagnes nationales', path: '/superadmin/campagnes', icon: 'campaign', roles: ['SUPER_ADMIN'] },
    { label: 'Notifications', path: '/superadmin/notifications', icon: 'notifications', roles: ['SUPER_ADMIN'] },
  ];

  userNav: NavItem[] = [
    { label: 'Mon profil', path: '/donneur/profil', icon: 'person', roles: ['USER'] },
    { label: 'Donner', path: '/donneur/dons', icon: 'volunteer_activism', roles: ['USER'] },
    { label: 'Mes dons', path: '/donneur/dons', icon: 'history', roles: ['USER'] },
    { label: 'Demandes', path: '/donneur/demandes', icon: 'emergency', roles: ['USER'] },
    { label: 'Leaderboard', path: '/donneur/leaderboard', icon: 'emoji_events', roles: ['USER'] },
    { label: 'Campagnes', path: '/donneur/campagnes', icon: 'campaign', roles: ['USER'] },
    { label: 'Chatbot', path: '/chatbot', icon: 'smart_toy', roles: ['USER'] },
  ];

  patientNav: NavItem[] = [
    { label: 'Tableau de bord', path: '/patient/dashboard', icon: 'dashboard', roles: ['USER'] },
    { label: 'Mon profil', path: '/patient/profil', icon: 'medical_services', roles: ['USER'] },
    { label: 'Demander du sang', path: '/patient/hopitaux', icon: 'emergency', roles: ['USER'] },
    { label: 'Mes demandes', path: '/patient/demandes', icon: 'history', roles: ['USER'] },
    { label: 'Hôpitaux', path: '/patient/hopitaux', icon: 'local_hospital', roles: ['USER'] },
    { label: 'Chatbot', path: '/chatbot', icon: 'smart_toy', roles: ['USER'] },
  ];

  hospitalNav: NavItem[] = [
    { label: 'Demandes de sang', path: '/hospital/demandes', icon: 'emergency', roles: ['HOSPITAL'] },
    { label: 'Stocks', path: '/hospital/stocks', icon: 'bloodtype', roles: ['HOSPITAL'] },
    { label: 'Profil', path: '/hospital/profile', icon: 'medical_services', roles: ['HOSPITAL'] },
  ];

  navItems = computed(() => {
    const currentUser = this.currentUser();
    const r = this.role();
    
    if (r === 'SUPER_ADMIN') return this.superAdminNav;
    if (r === 'ADMIN') return this.adminNav;
    if (r === 'USER') {
      // Check active role mode
      if (currentUser?.isPatientActif && !currentUser?.isDonneurActif) {
        return this.patientNav;
      } else {
        return this.userNav;
      }
    }
    if (r === 'HOSPITAL') return this.hospitalNav;
    return [];
  });

  constructor(public authService: AuthService) {
    this.currentUser = this.authService.currentUser;
    this.role = computed(() => this.currentUser()?.role ?? null);
  }
}
