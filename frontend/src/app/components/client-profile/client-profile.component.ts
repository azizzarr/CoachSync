import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HighchartsChartModule } from 'highcharts-angular';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { PersonalInfoCardComponent } from './components/personal-info-card/personal-info-card.component';
import { StatsGridComponent } from './components/stats-grid/stats-grid.component';
import { TimelineActivityComponent, Activity } from './components/timeline-activity/timeline-activity.component';
import { ProgressGalleryComponent, ProgressPhoto } from './components/progress-gallery/progress-gallery.component';
import { AddWeightModalComponent } from '../add-weight-modal/add-weight-modal.component';
import * as Highcharts from 'highcharts';
import { UserProfileService, UserProfile, UserProfileDTO, WeightProgress } from '../../services/user-profile.service';
import { WorkoutPlanService, WorkoutPlanResponse, WorkoutPlan, WorkoutDay } from '../../services/workout-plan.service';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileConfirmationDialogComponent } from './components/profile-confirmation-dialog/profile-confirmation-dialog.component';

type TimeFrame = 'week' | 'month' | 'year';

export interface Workout {
  id: string;
  workoutDate: string;
  workoutType: string;
  durationMinutes: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
  }>;
  notes: string;
  caloriesBurnt: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    HighchartsChartModule,
    ProfileHeaderComponent,
    PersonalInfoCardComponent,
    StatsGridComponent,
    TimelineActivityComponent,
    ProgressGalleryComponent,
    MatDialogModule,
    AddWeightModalComponent,
    MatSnackBarModule,
    ProfileConfirmationDialogComponent
  ],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  selectedTimeFrame: TimeFrame = 'week';
  timeFrames: TimeFrame[] = ['week', 'month', 'year'];
  userProfile: UserProfile | null = null;
  personalProfile?: UserProfileDTO;
  isLoading = true;
  error: string | null = null;
  isMobile$: Observable<boolean>;
  expandedCards: Set<string> = new Set<string>();
  showWeightModal = false;
  isGeneratingWorkoutPlan = false;
  workoutPlanResponse: WorkoutPlanResponse | null = null;
  aiWorkoutData: WorkoutPlan | null = null;
  totalAiWorkouts = 0;
  totalAiWorkoutHours = 0;
  totalAiCalories = 0;

  goals = [
    { title: 'Weight Loss', icon: 'scale', progress: 12, target: 80 },
    { title: 'Muscle Gain', icon: 'fitness_center', progress: 8, target: 90 },
    { title: 'Endurance', icon: 'directions_run', progress: 15, target: 100 }
  ];

  activities: Activity[] = [
    {
      id: '1',
      title: 'Upper Body Strength Training',
      description: 'Focus on chest, shoulders, and triceps with progressive overload.',
      date: new Date(2023, 5, 15, 14, 30),
      type: 'workout',
      status: 'completed',
      coachName: 'Sarah Johnson',
      coachAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      exerciseDetails: {
        sets: 4,
        reps: 12,
        weight: 135,
        notes: 'Increase weight by 5lbs next session if form remains good.'
      }
    },
    {
      id: '2',
      title: 'Monthly Progress Assessment',
      description: 'Body composition, strength tests, and flexibility evaluation.',
      date: new Date(2023, 5, 10, 10, 0),
      type: 'assessment',
      status: 'completed',
      coachName: 'Sarah Johnson',
      coachAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      attachments: [
        {
          name: 'Body Composition Report',
          url: '#',
          type: 'pdf'
        }
      ]
    },
    {
      id: '3',
      title: 'New Goal: 5K Run',
      description: 'Complete a 5K run in under 25 minutes within 8 weeks.',
      date: new Date(2023, 5, 5, 9, 15),
      type: 'progress',
      status: 'in-progress',
      coachName: 'Sarah Johnson',
      coachAvatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '4',
      title: 'HIIT Cardio Session',
      description: 'High-intensity interval training focusing on fat burning.',
      date: new Date(2023, 5, 3, 16, 0),
      type: 'workout',
      status: 'completed',
      coachName: 'Sarah Johnson',
      coachAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      exerciseDetails: {
        sets: 8,
        duration: 30,
        notes: 'Great effort! Heart rate stayed in target zone for 85% of the session.'
      }
    },
    {
      id: '5',
      title: 'Nutrition Consultation',
      description: 'Discussion about meal planning and protein intake for muscle gain.',
      date: new Date(2023, 5, 1, 11, 30),
      type: 'nutrition',
      status: 'completed',
      coachName: 'Sarah Johnson',
      coachAvatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  ];

  progressChartOptions: Highcharts.Options = {};
  nutritionChartOptions: Highcharts.Options = {};

  workoutHistory: Workout[] = [];
  displayedColumns = ['date', 'type', 'duration', 'exercises', 'calories', 'notes'];

  progressPhotos: ProgressPhoto[] = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: new Date(2024, 2, 1),
      weight: 85,
      category: 'front',
      notes: 'Starting point - Beginning of transformation journey'
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: new Date(2024, 1, 15),
      weight: 82,
      category: 'front',
      notes: 'After 2 weeks of consistent training'
    }
  ];

  constructor(
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private workoutPlanService: WorkoutPlanService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
  ) {
    this.isMobile$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadAiWorkoutStats();
  }

  private loadUserProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userProfileService.getUserProfile(user.uid).subscribe({
        next: (profile: UserProfile) => {
          this.userProfile = {
            ...profile,
            isActive: profile.isActive !== undefined ? profile.isActive : true
          };
          this.initChartOptions();
          this.loadPersonalProfile(user.uid);
          this.loadUserWorkouts(user.uid);
        },
        error: (err: unknown) => {
          this.error = 'Failed to load profile';
          this.isLoading = false;
          console.error('Failed to load profile', err);
        }
      });
    }
  }

  private loadPersonalProfile(userId: string) {
    this.userProfileService.getPersonalProfile(userId).subscribe({
      next: (profile: UserProfileDTO) => {
        this.personalProfile = profile;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        this.error = 'Failed to load personal profile';
        this.isLoading = false;
        console.error('Failed to load personal profile', err);
      }
    });
  }

  private loadUserWorkouts(userId: string) {
    this.userProfileService.getUserWorkouts(userId).subscribe({
      next: (workouts: Workout[]) => {
        this.workoutHistory = workouts.map(workout => ({
          ...workout,
          exercises: typeof workout.exercises === 'string' 
            ? JSON.parse(workout.exercises)
            : workout.exercises
        }));
      },
      error: (err: unknown) => {
        console.error('Failed to load workouts', err);
      }
    });
  }

  onEditPersonalInfo(): void {
    // Handle edit personal info
    console.log('Edit personal info clicked');
  }

  private initChartOptions() {
    if (!this.userProfile) return;

    // Get weight progress data
    const weightData = this.userProfile.weightProgress
      ?.sort((a, b) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime())
      .map(entry => ({
        date: new Date(entry.measurementDate),
        weight: entry.weightKg
      })) || [];

    // Prepare chart data
    const categories = weightData.map(entry => 
      entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const weightValues = weightData.map(entry => entry.weight);

    this.progressChartOptions = {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        height: window.innerWidth <= 768 ? 120 : 140,
        style: {
          fontFamily: 'Roboto, sans-serif'
        },
        spacing: window.innerWidth <= 768 ? [10, 10, 10, 10] : [15, 15, 15, 15]
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            color: '#ffffff',
            fontSize: window.innerWidth <= 768 ? '10px' : '12px'
          },
          rotation: window.innerWidth <= 768 ? -45 : 0
        },
        lineColor: '#ffffff',
        tickColor: '#ffffff',
        tickLength: window.innerWidth <= 768 ? 3 : 5
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            color: '#ffffff',
            fontSize: window.innerWidth <= 768 ? '10px' : '12px'
          }
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)'
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true,
            radius: window.innerWidth <= 768 ? 2 : 3,
            symbol: 'circle',
            states: {
              hover: {
                radius: window.innerWidth <= 768 ? 4 : 6
              }
            }
          },
          lineWidth: window.innerWidth <= 768 ? 2 : 3,
          states: {
            hover: {
              lineWidth: window.innerWidth <= 768 ? 3 : 4
            }
          }
        }
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.y} kg</b><br/>${this.x}`;
        },
        style: {
          fontSize: window.innerWidth <= 768 ? '11px' : '12px'
        }
      },
      series: [{
        type: 'line',
        name: 'Weight',
        data: weightValues,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(255, 107, 107, 0.6)'],
            [1, 'rgba(255, 107, 107, 0.2)']
          ]
        }
      }]
    };

    this.nutritionChartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: window.innerWidth <= 768 ? 120 : 140,
        style: {
          fontFamily: 'Roboto, sans-serif'
        },
        spacing: window.innerWidth <= 768 ? [10, 10, 10, 10] : [15, 15, 15, 15]
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['Protein', 'Carbs', 'Fats'],
        labels: {
          style: {
            color: '#ffffff80',
            fontSize: window.innerWidth <= 768 ? '10px' : '11px'
          }
        },
        lineWidth: 0,
        tickLength: 0,
        gridLineWidth: 0
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            color: '#ffffff80',
            fontSize: window.innerWidth <= 768 ? '10px' : '11px'
          }
        },
        gridLineWidth: 1,
        gridLineColor: '#ffffff10',
        gridLineDashStyle: 'Dash'
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          borderRadius: window.innerWidth <= 768 ? 4 : 6,
          pointPadding: window.innerWidth <= 768 ? 0.1 : 0.2,
          groupPadding: window.innerWidth <= 768 ? 0.05 : 0.1,
          borderWidth: 0,
          states: {
            hover: {
              brightness: 0.1
            }
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(45, 45, 45, 0.9)',
        borderWidth: 0,
        borderRadius: 8,
        style: {
          color: '#fff',
          fontSize: window.innerWidth <= 768 ? '11px' : '12px'
        },
        shadow: true,
        padding: window.innerWidth <= 768 ? 8 : 12,
        formatter: function() {
          return `<b>${this.y}g</b> ${this.x}`;
        }
      },
      series: [{
        type: 'column',
        name: 'Nutrition',
        data: [{
          y: 120,
          color: '#4CAF50'
        }, {
          y: 180,
          color: '#2196F3'
        }, {
          y: 60,
          color: '#FFC107'
        }]
      }]
    };
  }

  openActivityTimelineModal(): void {
    this.dialog.open(TimelineActivityComponent, {
      data: this.activities,
      width: '800px',
      maxHeight: '90vh',
      panelClass: 'activity-timeline-modal',
      autoFocus: false
    });
  }

  toggleCardExpansion(cardId: string): void {
    if (this.expandedCards.has(cardId)) {
      this.expandedCards.delete(cardId);
    } else {
      this.expandedCards.add(cardId);
    }
  }

  isCardExpanded(cardId: string): boolean {
    return this.expandedCards.has(cardId);
  }

  openAddWeightModal(): void {
    this.showWeightModal = true;
  }

  handleWeightModalClose(): void {
    this.showWeightModal = false;
  }

  handleWeightMeasurementSubmit(weightMeasurement: Partial<WeightProgress>): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.userProfileService.addWeightMeasurement(user.uid, weightMeasurement).subscribe({
      next: (newWeightMeasurement) => {
        // Add the new measurement to the user profile
        if (this.userProfile && this.userProfile.weightProgress) {
          this.userProfile.weightProgress.push(newWeightMeasurement);
          // Reinitialize the chart with the updated data
          this.initChartOptions();
        }
        this.showWeightModal = false;
      },
      error: (err) => {
        console.error('Failed to add weight measurement', err);
      }
    });
  }

  /**
   * Generates a personalized workout plan for the user
   */
  generateWorkoutPlan(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.snackBar.open('User not authenticated. Please log in again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ProfileConfirmationDialogComponent, {
      data: this.personalProfile,
      width: '100%',
      maxWidth: '600px',
      panelClass: 'full-width-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // If generation was successful, update the state
        this.isGeneratingWorkoutPlan = false;
        // Optionally refresh the workout plan data
        this.loadUserWorkouts(user.uid);
      } else {
        // If user declined or there was an error, reset the state
        this.isGeneratingWorkoutPlan = false;
      }
    });
  }

  private loadAiWorkoutStats(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }
    this.workoutPlanService.getLatestWorkoutPlan(user.uid).subscribe({
      next: (workoutPlan: WorkoutPlan) => {
        this.aiWorkoutData = workoutPlan;
        this.computeAiStats();
      },
      error: (err) => {
        // Optionally handle error
        this.aiWorkoutData = null;
        this.totalAiWorkouts = 0;
        this.totalAiWorkoutHours = 0;
        this.totalAiCalories = 0;
      }
    });
  }

  private computeAiStats(): void {
    if (!this.aiWorkoutData) {
      this.totalAiWorkouts = 0;
      this.totalAiWorkoutHours = 0;
      this.totalAiCalories = 0;
      return;
    }
    const schedule = this.aiWorkoutData.weeklySchedule || [];
    this.totalAiWorkouts = schedule.length;
    this.totalAiWorkoutHours = schedule.reduce((sum, day) => sum + (day.durationMinutes || 0), 0) / 60;
    this.totalAiCalories = schedule.reduce((sum, day) => sum + (day.caloriesBurnt || 0), 0);
  }
}

