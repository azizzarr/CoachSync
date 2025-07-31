import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachDashboardComponent } from './coach-dashboard.component';
import { StatsOverviewComponent } from './components/stats-overview/stats-overview.component';
import { ClientTableComponent } from './components/client-table/client-table.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ExerciseAssignmentComponent } from './components/exercise-assignment/exercise-assignment.component';




const routes: Routes = [
  {
    path: '',
    component: CoachDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StatsOverviewComponent },
      { path: 'clients', component: ClientTableComponent },
      { path: 'app-calendar', component: CalendarComponent },
      { path: 'exercises', component: ExerciseAssignmentComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachDashboardRoutingModule { } 