import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { CoachHeaderComponent } from './components/coach-header/coach-header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CoachDashboardRoutingModule } from './coach-dashboard-routing.module';
import { StatsOverviewComponent } from './components/stats-overview/stats-overview.component';
import { ActivityTimelineComponent } from './components/activity-timeline/activity-timeline.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CoachHeaderComponent,
    SidebarComponent,
    CoachDashboardRoutingModule,
    StatsOverviewComponent,
    ActivityTimelineComponent
  ],
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default // Change to Default for debugging
})
export class CoachDashboardComponent implements OnInit {
  faEllipsis = faEllipsis;
  isSidebarCollapsed = true; // Initially collapsed
  
  // Use a BehaviorSubject to track sidebar state
  private sidebarStateSubject = new BehaviorSubject<boolean>(true); // Initially collapsed
  sidebarState$ = this.sidebarStateSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    console.log('CoachDashboardComponent initialized');
  }

  onSidebarToggle(collapsed: boolean): void {
    // Update the sidebar state using the BehaviorSubject
    this.sidebarStateSubject.next(collapsed);
    this.isSidebarCollapsed = collapsed;
  }
} 