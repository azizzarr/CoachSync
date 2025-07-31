import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faEdit, 
  faMessage, 
  faCalendarDays, 
  faEllipsisVertical,
  faDownload,
  faChartLine,
  faUserGroup,
  faDumbbell
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-coach-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    FontAwesomeModule
  ],
  templateUrl: './coach-header.component.html',
  styleUrls: ['./coach-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachHeaderComponent implements OnInit {
  // Icons
  faEdit = faEdit;
  faMessage = faMessage;
  faCalendarDays = faCalendarDays;
  faEllipsisVertical = faEllipsisVertical;
  faDownload = faDownload;
  faChartLine = faChartLine;
  faUserGroup = faUserGroup;
  faDumbbell = faDumbbell;

  // Mock data - replace with actual data from service
  coachInfo = {
    name: 'Mohamed Aziz Zarkaoui',
    id: 'COACH-001',
    memberSince: new Date('2020-01-01'),
    specialization: 'Personal Coach',
    clientsCount: 25,
    rating: 4.8
  };

  // Profile photo URL with optimized version
  profilePhotoUrl = 'https://randomuser.me/api/portraits/men/32.jpg';
  profilePhotoLoaded = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Preload the profile photo
    this.preloadProfilePhoto();
  }

  private preloadProfilePhoto(): void {
    const img = new Image();
    img.onload = () => {
      this.profilePhotoLoaded = true;
      this.cdr.markForCheck();
    };
    img.src = this.profilePhotoUrl;
  }

  onEditProfile(): void {
    // Implement edit profile functionality
    this.cdr.markForCheck();
  }

  onMessage(): void {
    // Implement message functionality
    this.cdr.markForCheck();
  }

  onSchedule(): void {
    // Implement schedule functionality
    this.cdr.markForCheck();
  }

  onDownloadReport(): void {
    // Implement download report functionality
    this.cdr.markForCheck();
  }
} 