import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileService, UserProfileDTO } from '../../../../services/user-profile.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-personal-info-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './personal-info-card.component.html',
  styleUrls: ['./personal-info-card.component.scss']
})
export class PersonalInfoCardComponent implements OnInit {
  @Input() clientInfo?: UserProfileDTO;
  profile?: UserProfileDTO;
  @Output() edit = new EventEmitter<void>();
  isExpanded = true;

  constructor(
    private userProfileService: UserProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.clientInfo) {
      this.profile = this.clientInfo;
    } else {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userProfileService.getPersonalProfile(user.uid).subscribe({
          next: (profile: UserProfileDTO) => (this.profile = profile),
          error: (err: unknown) => console.error('Failed to load profile', err)
        });
      }
    }
  }

  onEdit(): void {
    this.edit.emit();
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
} 