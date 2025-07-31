import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ExerciseDetails {
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  type?: string;
  restPeriod?: number;
  intensity?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'video' | 'other';
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'workout' | 'assessment' | 'nutrition' | 'progress';
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  coachName?: string;
  coachAvatar?: string;
  exerciseDetails?: ExerciseDetails;
  attachments?: Attachment[];
}

@Component({
  selector: 'app-timeline-activity',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './timeline-activity.component.html',
  styleUrls: ['./timeline-activity.component.scss']
})
export class TimelineActivityComponent implements OnInit {
  @Input() activities: Activity[] = [];
  displayedActivities: Activity[] = [];
  isCollapsed = true;

  ngOnInit() {
    this.displayedActivities = this.activities.slice(0, 5);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getActivityColor(type: string): string {
    const colors = {
      'workout': '#4CAF50',
      'assessment': '#2196F3',
      'nutrition': '#FF9800',
      'progress': '#9C27B0'
    };
    return colors[type as keyof typeof colors] || '#757575';
  }

  getActivityIcon(type: string): string {
    const icons = {
      'workout': 'fitness_center',
      'assessment': 'assessment',
      'nutrition': 'restaurant_menu',
      'progress': 'trending_up'
    };
    return icons[type as keyof typeof icons] || 'event';
  }

  getStatusColor(status: string): string {
    const colors = {
      'completed': '#4CAF50',
      'in-progress': '#2196F3',
      'scheduled': '#FF9800',
      'cancelled': '#F44336'
    };
    return colors[status as keyof typeof colors] || '#757575';
  }

  getStatusIcon(status: string): string {
    const icons = {
      'completed': 'check_circle',
      'in-progress': 'pending',
      'scheduled': 'schedule',
      'cancelled': 'cancel'
    };
    return icons[status as keyof typeof icons] || 'help';
  }

  getAttachmentIcon(type: string): string {
    const icons = {
      'pdf': 'picture_as_pdf',
      'image': 'image',
      'video': 'videocam',
      'other': 'attach_file'
    };
    return icons[type as keyof typeof icons] || 'attach_file';
  }
}
