import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome,
  faUserGroup,
  faChartLine,
  faCalendarDays,
  faDumbbell,
  faMessage,
  faCog,
  faSignOut,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-coach-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  // Icons
  faHome = faHome;
  faUserGroup = faUserGroup;
  faChartLine = faChartLine;
  faCalendarDays = faCalendarDays;
  faDumbbell = faDumbbell;
  faMessage = faMessage;
  faCog = faCog;
  faSignOut = faSignOut;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  // Sidebar state - initially collapsed
  @Input() isCollapsed = false;

  // Output event for parent component
  @Output() sidebarToggle = new EventEmitter<boolean>();

  // Navigation items
  navItems = [
    { path: '/coach-dashboard', icon: faHome, label: 'Dashboard' },
    { path: '/app-client-table', icon: faUserGroup, label: 'Client Table' },
    { path: '/app-calendar', icon: faCalendarDays, label: 'Schedule' },
    { path: '/app-exercise-assignment', icon: faDumbbell, label: 'Workouts' },
    { path: '/coach/messages', icon: faMessage, label: 'Messages' },
    { path: '/coach/settings', icon: faCog, label: 'Settings' }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Preload any necessary data or resources
    this.preloadResources();
    
    // Emit the initial collapsed state to the parent component
    this.sidebarToggle.emit(this.isCollapsed);
  }

  private preloadResources(): void {
    // Preload images or other resources
    const preloadImage = new Image();
    preloadImage.src = 'https://randomuser.me/api/portraits/men/32.jpg';
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
    // Mark for check to ensure the view updates
    this.cdr.markForCheck();
  }

  onSignOut(): void {
    // Implement sign out functionality
    this.router.navigate(['/login']);
  }
} 