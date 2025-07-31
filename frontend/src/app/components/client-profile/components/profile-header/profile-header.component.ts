import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUser, 
  faEdit, 
  faIdBadge, 
  faCheckCircle, 
  faPauseCircle, 
  faCalendar, 
  faDumbbell, 
  faUserTie, 
  faStar, 
  faMessage, 
  faCalendarDays, 
  faEllipsisVertical,
  faDownload,
  faBan,
  faDumbbell as faDumbbellSolid,
  faRobot,
  faBrain,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';
import { UserProfile } from '../../../../services/user-profile.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    FontAwesomeModule
  ],
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent {
  // Font Awesome icons
  faUser = faUser;
  faEdit = faEdit;
  faIdBadge = faIdBadge;
  faCheckCircle = faCheckCircle;
  faPauseCircle = faPauseCircle;
  faCalendar = faCalendar;
  faDumbbell = faDumbbell;
  faUserTie = faUserTie;
  faStar = faStar;
  faMessage = faMessage;
  faCalendarDays = faCalendarDays;
  faEllipsisVertical = faEllipsisVertical;
  faDownload = faDownload;
  faBan = faBan;
  faDumbbellSolid = faDumbbellSolid;
  faRobot = faRobot;
  faBrain = faBrain;
  faWandMagicSparkles = faWandMagicSparkles;

  @Input() userProfile!: UserProfile;
  @Input() isGeneratingWorkoutPlan = false;
  @Output() generateWorkoutPlan = new EventEmitter<void>();

  get memberSince(): string {
    return this.userProfile.createdAt ? new Date(this.userProfile.createdAt).toLocaleDateString() : 'N/A';
  }

  get displayName(): string {
    return this.userProfile.fullName || this.userProfile.email || 'User';
  }

  get avatarUrl(): string {
    // If the user has a photo URL from Firebase, use it
    if (this.userProfile.avatarUrl) {
      return this.userProfile.avatarUrl;
    }
    // Otherwise, use a default avatar based on the user's email
    return `https://www.gravatar.com/avatar/${this.hashEmail(this.userProfile.email)}?d=mp&s=200`;
  }

  private hashEmail(email: string): string {
    // Simple hash function for email
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  onEditPhoto() {
    // Implement photo edit functionality
    console.log('Edit photo clicked');
  }

  onEditProfile() {
    // Implement edit profile functionality
    console.log('Edit profile clicked');
  }

  onMessage() {
    // Implement message functionality
    console.log('Message clicked');
  }

  onSchedule() {
    // Implement schedule functionality
    console.log('Schedule clicked');
  }

  onDeactivate() {
    // Implement deactivate functionality
    console.log('Deactivate clicked');
  }

  onDownloadReport() {
    // Implement download report functionality
    console.log('Download report clicked');
  }

  onToggleStatus(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    // Here you would typically make an API call to update the user's status
    console.log('User status changed to:', checkbox.checked ? 'Active' : 'Paused');
  }

  onGenerateWorkoutPlan() {
    this.generateWorkoutPlan.emit();
  }
} 