import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserPlus, 
  faCalendarCheck, 
  faChartLine, 
  faMessage, 
  faDumbbell,
  faCircleCheck,
  faSpinner,
  faClock,
  faFilter,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

interface ActivityItem {
  id: string;
  type: 'new_client' | 'session_completed' | 'progress_update' | 'message' | 'workout_plan';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'in_progress';
  clientName?: string;
  clientAvatar?: string;
  read?: boolean;
  metadata?: {
    [key: string]: any;
  };
}

type ActivityType = ActivityItem['type'];
type ActivityStatus = ActivityItem['status'];

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule, FontAwesomeModule],
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTimelineComponent implements OnInit {
  // Icons
  faUserPlus = faUserPlus;
  faCalendarCheck = faCalendarCheck;
  faChartLine = faChartLine;
  faMessage = faMessage;
  faDumbbell = faDumbbell;
  faCircleCheck = faCircleCheck;
  faSpinner = faSpinner;
  faClock = faClock;
  faFilter = faFilter;

  // Mock activities data
  activities: ActivityItem[] = [
    {
      id: '1',
      type: 'new_client',
      title: 'New Client Registration',
      description: 'Sarah Johnson has registered for personal training sessions',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'completed',
      clientName: 'Sarah Johnson',
      clientAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      read: true
    },
    {
      id: '2',
      type: 'session_completed',
      title: 'Training Session Completed',
      description: 'Completed HIIT session with Mike Thompson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      status: 'completed',
      clientName: 'Mike Thompson',
      clientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      read: true,
      metadata: {
        sessionType: 'HIIT',
        duration: '45 minutes'
      }
    },
    {
      id: '3',
      type: 'progress_update',
      title: 'Client Progress Updated',
      description: 'Updated weight and measurement records for Emily Clark',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'completed',
      clientName: 'Emily Clark',
      clientAvatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      read: false
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      description: 'David Wilson sent you a message about tomorrow\'s session',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      status: 'pending',
      clientName: 'David Wilson',
      clientAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      read: false
    },
    {
      id: '5',
      type: 'workout_plan',
      title: 'Workout Plan Created',
      description: 'Created a new 4-week strength training plan for Alex Martinez',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      status: 'in_progress',
      clientName: 'Alex Martinez',
      clientAvatar: 'https://randomuser.me/api/portraits/men/61.jpg',
      read: true,
      metadata: {
        planDuration: '4 weeks',
        focusArea: 'Strength Training'
      }
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  getActivityIcon(type: ActivityType): IconDefinition {
    const icons: Record<ActivityType, IconDefinition> = {
      new_client: this.faUserPlus,
      session_completed: this.faCalendarCheck,
      progress_update: this.faChartLine,
      message: this.faMessage,
      workout_plan: this.faDumbbell
    };
    return icons[type] || this.faCalendarCheck;
  }

  getStatusIcon(status: ActivityStatus): IconDefinition {
    const icons: Record<ActivityStatus, IconDefinition> = {
      completed: this.faCircleCheck,
      in_progress: this.faSpinner,
      pending: this.faClock
    };
    return icons[status] || this.faClock;
  }

  toggleFilter(): void {
    // Implement filter functionality
  }
}
