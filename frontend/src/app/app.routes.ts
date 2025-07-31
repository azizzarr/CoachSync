import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'classes', loadComponent: () => import('./components/classes/classes.component').then(m => m.ClassesComponent) },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'coach-dashboard', 
    loadComponent: () => import('./components/coach-dashboard/coach-dashboard.component').then(m => m.CoachDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'client-profile', 
    loadComponent: () => import('./components/client-profile/client-profile.component').then(m => m.ClientProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'app-client-table', 
    loadComponent: () => import('./components/coach-dashboard/components/client-table/client-table.component').then(m => m.ClientTableComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'app-calendar', 
    loadComponent: () => import('./components/coach-dashboard/components/calendar/calendar.component').then(m => m.CalendarComponent),
    canActivate: [AuthGuard]
  },
    {
      path: 'app-onboarding',
      loadComponent: () => import('./components/onboarding/onboarding.component').then(m => m.OnboardingComponent),
      canActivate: [AuthGuard]
    },
  { 
    path: 'app-exercise-assignment', 
    loadComponent: () => import('./components/coach-dashboard/components/exercise-assignment/exercise-assignment.component').then(m => m.ExerciseAssignmentComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'workout-calendar', 
    loadComponent: () => import('./components/workout-calendar/workout-calendar.component').then(m => m.WorkoutCalendarComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/home' }
];
