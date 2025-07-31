import { Component, OnInit, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkoutPlanService, WorkoutPlan } from '../../services/workout-plan.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  notes: string;
}

interface WorkoutDay {
  day: string;
  workoutType: string;
  durationMinutes: number;
  caloriesBurnt: number;
  exercises: Exercise[];
  notes: string;
}

interface WorkoutData {
  weeklySchedule: WorkoutDay[];
  progressionPlan: string;
  safetyPrecautions: string;
}

@Component({
  selector: 'app-workout-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './workout-calendar.component.html',
  styleUrls: ['./workout-calendar.component.scss']
})
export class WorkoutCalendarComponent implements OnInit {
  @ViewChild('workoutDetailsDialog') workoutDetailsDialog!: TemplateRef<any>;
  
  currentView = signal<'calendar' | 'list'>('calendar');
  selectedDay = signal<WorkoutDay | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  workoutData: WorkoutData = {
    weeklySchedule: [],
    progressionPlan: '',
    safetyPrecautions: ''
  };

  constructor(
    private dialog: MatDialog,
    private workoutPlanService: WorkoutPlanService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadWorkoutPlan();
  }

  loadWorkoutPlan(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error.set('User not authenticated');
      this.isLoading.set(false);
      return;
    }

    this.workoutPlanService.getLatestWorkoutPlan(user.uid).subscribe({
      next: (workoutPlan: WorkoutPlan) => {
        this.workoutData = workoutPlan;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading workout plan:', err);
        this.error.set('Failed to load workout plan');
        this.isLoading.set(false);
        this.snackBar.open('Failed to load workout plan. Please try again later.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  toggleView(view: 'calendar' | 'list'): void {
    this.currentView.set(view);
  }

  selectDay(day: WorkoutDay): void {
    this.selectedDay.set(day);
  }

  getWorkoutIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'strength':
        return 'fitness_center';
      case 'cardio':
        return 'directions_run';
      case 'flexibility':
        return 'self_improvement';
      case 'rest':
        return 'bedtime';
      default:
        return 'fitness_center';
    }
  }

  getWorkoutColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'strength':
        return '#2196F3';
      case 'cardio':
        return '#F44336';
      case 'flexibility':
        return '#4CAF50';
      case 'rest':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  }

  getWorkoutGradient(type: string): string {
    const color = this.getWorkoutColor(type);
    return `linear-gradient(45deg, ${color}, ${this.adjustColor(color, 20)})`;
  }

  private adjustColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  getTotalExercises(): number {
    return this.workoutData.weeklySchedule.reduce((total, day) => total + day.exercises.length, 0);
  }

  getTotalWorkoutTime(): number {
    return this.workoutData.weeklySchedule.reduce((total, day) => total + day.durationMinutes, 0);
  }

  getTotalCalories(): number {
    return this.workoutData.weeklySchedule.reduce((total, day) => total + day.caloriesBurnt, 0);
  }

  openWorkoutDetails(day: WorkoutDay): void {
    this.selectedDay.set(day);
    this.dialog.open(this.workoutDetailsDialog, {
      width: '900px',
      maxHeight: '90vh',
      panelClass: 'workout-details-dialog-container',
      backdropClass: 'workout-details-backdrop',
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      restoreFocus: true
    });
  }

  closeWorkoutDetails(): void {
    this.dialog.closeAll();
  }
}
