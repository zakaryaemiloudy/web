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
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    /* Smooth role mode transitions */
    .role-mode-indicator {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Enhanced hover effects */
    .nav-item {
      position: relative;
      overflow: hidden;
    }
    
    .nav-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
      transition: left 0.5s;
    }
    
    .nav-item:hover::before {
      left: 100%;
    }
    
    /* Smooth transitions for role badges */
    .role-badge {
      transition: all 0.3s ease-in-out;
    }
    
    .role-badge:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class SidebarComponent {
  adminNav: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', roles: ['ADMIN'] },
    { label: 'Demandes de sang', path: '/admin/demandes', icon: 'emergency', roles: ['ADMIN'] },
    { label: 'Donations', path: '/admin/dons', icon: 'volunteer_activism', roles: ['ADMIN'] },
    { label: 'Stocks', path: '/admin/stocks', icon: 'bloodtype', roles: ['ADMIN'] },
    { label: 'Donneurs', path: '/admin/donneurs', icon: 'people', roles: ['ADMIN'] },
    { label: 'Campagnes', path: '/admin/campagnes', icon: 'campaign', roles: ['ADMIN'] },
    { label: 'Vue Hôpital', path: '/hospital/demandes', icon: 'local_hospital', roles: ['ADMIN'] },
  ];

  superAdminNav: NavItem[] = [
    { label: 'Dashboard', path: '/superadmin/dashboard', icon: 'dashboard', roles: ['SUPER_ADMIN'] },
    { label: 'Hôpitaux', path: '/superadmin/hopitaux', icon: 'local_hospital', roles: ['SUPER_ADMIN'] },
    { label: '👥 Admins', path: '/superadmin/admins', icon: 'admin_panel_settings', roles: ['SUPER_ADMIN'] },
    { label: 'Gestion Demandes', path: '/hospital/demandes', icon: 'emergency', roles: ['SUPER_ADMIN'] },
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
    { label: '📋 Demandes de sang', path: '/hospital/demandes', icon: 'emergency', roles: ['HOSPITAL'] },
    { label: '🩸 Stocks sanguins', path: '/hospital/stocks', icon: 'bloodtype', roles: ['HOSPITAL'] },
    { label: '👤 Profil hôpital', path: '/hospital/profile', icon: 'medical_services', roles: ['HOSPITAL'] },
  ];

  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  currentUser = computed(() => this.authService.currentUser());
  role = computed(() => this.currentUser()?.role ?? null);
  
  // Computed properties for role mode detection
  isPatientMode = computed(() => {
    const user = this.currentUser();
    return user?.role === 'USER' && user?.isPatientActif && !user?.isDonneurActif;
  });
  
  isDonorMode = computed(() => {
    const user = this.currentUser();
    return user?.role === 'USER' && user?.isDonneurActif && !user?.isPatientActif;
  });
  
  isBothMode = computed(() => {
    const user = this.currentUser();
    return user?.role === 'USER' && user?.isDonneurActif && user?.isPatientActif;
  });

  navItems = computed(() => {
    const r = this.role();
    const isPatient = this.isPatientMode();
    const isDonor = this.isDonorMode();
    const isBoth = this.isBothMode();
    
    if (r === 'SUPER_ADMIN') return this.superAdminNav;
    if (r === 'ADMIN') return this.adminNav;
    if (r === 'USER') {
      // Prioritize patient mode when active
      if (isPatient) return this.patientNav;
      if (isDonor) return this.userNav;
      if (isBoth) {
        // When both modes are active, default to donor nav
        // but user can switch via profile
        return this.userNav;
      }
      // Default to donor nav for regular users
      return this.userNav;
    }
    if (r === 'HOSPITAL') return this.hospitalNav;
    return [];
  });
}
