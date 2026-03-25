# Blood Bank Frontend Implementation Guide

## ✅ Completed

### 1. **Types & DTOs** (`src/app/core/models/types.ts`)
- Updated all enum types (Role, GroupeSanguin, StatutDon, etc.)
- Added comprehensive request interfaces (DonRequest, DemandeSangRequest, HopitalRequest, etc.)
- Added complete response interfaces with all required fields
- Added DashboardAnalytics and StatistiquesGlobales for statistics

### 2. **API Services**
- ✅ **DonorApiService**: getDonneurs, createProfile, getProfile, declarerDon, getHistorique, getBadges, getPoints, getClassement, getCampagnes, participerCampagne
- ✅ **PatientApiService**: createDemande, getDemandes, getDemande, getStocks
- ✅ **SuperAdminApiService**: createHopital, getHopitaux, getHopitauxEnAttente, validerHopital, suspendreHopital, getStats, getDashboard, sendGlobalNotification, createNationalCampaign, getNationalCampaigns
- ✅ **NotificationApiService**: getAll, getUnread, getUnreadCount, markRead, markAllRead
- ✅ **ChatbotApiService**: sendMessage, getSuggestions, getHistorique, clearHistorique, getHealth

### 3. **Admin Dashboard**
- ✅ Added Bar chart for donations by blood group
- ✅ Added Doughnut chart for stock levels
- ✅ Updated stat cards with correct data binding
- ✅ Recent donations table with proper Donneur info

---

## 🔄 In Progress / TODO

### 4. **Admin Donations List** (`src/app/features/admin/donations/admin-donations.component.ts`)
**Required Features:**
- Display list of all donations with status
- Validate donation buttons (change status to VALIDE, generate POCHE number)
- Reject donation with reason modal
- Filter by status
- Sort by date

**Code Template:**
```typescript
export class AdminDonationsComponent implements OnInit {
  donations = signal<DonResponse[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.adminApi.getDons().subscribe({
      next: (data) => this.donations.set(data),
      complete: () => this.loading.set(false)
    });
  }

  validerDon(id: number) {
    this.adminApi.validerDon(id).subscribe({
      next: () => {
        this.donations.update(list =>
          list.map(d => d.id === id ? {...d, statut: 'VALIDE'} : d)
        );
      }
    });
  }

  rejeterDon(id: number, raison: string) {
    this.adminApi.rejeterDon(id, raison).subscribe({
      next: () => {
        this.donations.update(list =>
          list.map(d => d.id === id ? {...d, statut: 'REJETE'} : d)
        );
      }
    });
  }
}
```

---

### 5. **Admin Demands Management** (`src/app/features/admin/demands/admin-demands.component.ts`)
**Required Features:**
- Display list of blood requests with filters
- Status update dropdown (EN_ATTENTE → EN_COURS → SATISFAITE / REJETEE)
- Filter by urgency level
- Search by patient name
- Show stock availability for requested blood type

**Key Service Call:**
```typescript
traiterDemande(id: number, statut: StatutDemande): Observable<DemandeSangResponse>
```

---

### 6. **Admin Stocks View** (`src/app/features/admin/stocks/admin-stocks.component.ts`)
**Required Features:**
- Display stock levels for all blood groups with color coding
  - 🔴 CRITIQUE (red) - quantiteDisponible < seuilCritique
  - 🟠 ALERTE (orange) - quantiteDisponible < seuilAlerte
  - 🟡 NORMAL (yellow) - quantiteDisponible < seuilAlerte * 2
  - 🟢 OPTIMAL (green) - otherwise
- Progress bars showing percentage
- Last update timestamp
- Reserved quantity display

**CSS Status Classes:**
```css
.stock-critique { background-color: #EF4444; }
.stock-alerte { background-color: #F97316; }
.stock-normal { background-color: #FBBF24; }
.stock-optimal { background-color: #10B981; }
```

---

### 7. **Super Admin Dashboard** (`src/app/features/super-admin/dashboard/super-admin-dashboard.component.ts`)
**Required Features:**
- Global statistics cards (total hospitals, donors, donations, etc.)
- Hospitals per region chart (pie)
- Donations per month chart (line)
- Donors per city chart (bar)
- Performance metrics

---

### 8. **Hospital Management** (`src/app/features/super-admin/hospitals/hospitals.component.ts`)
**Required Features:**
- List all hospitals with status badges
- Create new hospital form
- Validate hospital (change status to VALIDE)
- Suspend hospital (change status to SUSPENDU)
- Filter by status (EN_ATTENTE, VALIDE, SUSPENDU)
- Edit hospital details

---

### 9. **Donor Profile** (`src/app/features/donor/profile/donor-profile.component.ts`)
**Required Features:**
- Display donor personal info
- Eligibility status with badge
- Eligibility rules check:
  - Age: 18-65 years
  - Weight: ≥ 50 kg
  - Last donation: ≥ 90 days ago
- Edit profile button
- Blood group display
- Medical history

---

### 10. **Donor Donations History** (`src/app/features/donor/donate/donor-donations.component.ts`)
**Required Features:**
- Donation declaration form
- Hospital dropdown
- Quantity selector (350-500 mL)
- History table showing all donations
- Status badges
- Chart: donations trend over time (line chart)
- Next eligibility date display

---

### 11. **Badges & Gamification** (`src/app/features/donor/badges/donor-badges.component.ts`)
**Required Features:**
- Display 8 badge tiers with icons
- Show earned badges with date
- Show locked badges with progress to next
- Points counter display
- Badge levels: BRONZE, ARGENT, OR, PLATINE, DIAMANT, HERO, LEGENDE, CHAMPION
- Don requirements: 1, 5, 10, 20, 30, 50, 75, 100

---

### 12. **Leaderboard** (`src/app/features/donor/leaderboard/leaderboard.component.ts`)
**Required Features:**
- Top 50 donors ranked by donations
- Display rank, name, blood group, total donations
- Filter by blood group
- Display donor's own rank

---

### 13. **Patient Blood Requests** (`src/app/features/patient/demands/patient-demands.component.ts`)
**Required Features:**
- Create blood request form with fields:
  - Blood group (dropdown)
  - Quantity (min 100 mL)
  - Urgency level (NORMALE, HAUTE, CRITIQUE)
  - Patient name/first name
  - Diagnosis
  - Doctor name
  - Needed date
  - Hospital
- Request history table
- Status badges
- Track request progress

---

### 14. **Notifications** (`src/app/features/notifications/notifications.component.ts`)
**Required Features:**
- List all notifications
- Unread badge color coding
- Mark as read
- Mark all as read
- Delete notification
- Filter by type (INFO, ALERTE, URGENCE, SUCCES)
- Auto-refresh every 30 seconds

**Service Integration:**
```typescript
this.notificationApi.getUnreadCount().pipe(
  switchMap(() => this.notificationApi.getAll()),
  repeat({ delay: 30000 })
).subscribe(notifications => this.notifications.set(notifications));
```

---

### 15. **Chatbot** (`src/app/features/chatbot/chatbot.component.ts`)
**Required Features:**
- Message input and send
- Conversation history display
- Quick action buttons from suggestions
- Session management (UUID)
- Message typing animation
- Bot response with suggestions
- Type indicators (TEXT, ACTION, LISTE)

---

### 16. **Campaign Management**
**Admin Campaigns** (`src/app/features/admin/campaigns/admin-campaigns.component.ts`)
- Create local campaigns
- View active campaigns
- Track participation progress
- Display campaign details

**Donor Campaigns** (`src/app/features/donor/campaigns/donor-campaigns.component.ts`)
- View active campaigns
- Join campaign button
- Display participation count
- Campaign progress bar

**National Campaigns** (`src/app/features/super-admin/campaigns/national-campaigns.component.ts`)
- Create national campaigns
- View all national campaigns

---

## 🎨 UI/UX Guidelines

### Color Scheme (Tailwind)
- Primary Red: `#EF4444` (bg-red-500)
- Secondary Orange: `#F97316` (bg-orange-500)
- Accent Blue: `#3B82F6` (bg-blue-500)
- Success Green: `#10B981` (bg-emerald-500)
- Warning Yellow: `#FBBF24` (bg-amber-400)

### Component Structure
```
<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h3 class="text-sm font-medium text-gray-700 mb-4">Title</h3>
  <!-- Content -->
</div>
```

### Status Badge Colors
```typescript
const statusColors: Record<string, string> = {
  'EN_ATTENTE': 'text-blue-600 bg-blue-50',
  'VALIDE': 'text-green-600 bg-green-50',
  'REJETE': 'text-red-600 bg-red-50',
  'UTILISE': 'text-purple-600 bg-purple-50',
  'PERIME': 'text-gray-600 bg-gray-50'
};
```

---

## 📱 Responsive Design Patterns

### Grid Layouts
- **4 Columns Desktop**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **2 Columns Desktop**: `grid-cols-1 lg:grid-cols-2`
- **3 Columns Desktop**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 🔐 Authentication & Access Control

### Role-Based Route Guards
```typescript
// In routes
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
}
```

### Current User Access
```typescript
constructor(private authService: AuthService) {
  this.currentUser = this.authService.getCurrentUser();
}
```

---

## 🚀 Next Steps
1. Implement remaining components following templates above
2. Add form validation with error messages
3. Add loading spinners and skeletons
4. Add success/error toasts
5. Add pagination for large lists
6. Add search/filter functionality
7. Test all API integrations
8. Performance optimization

