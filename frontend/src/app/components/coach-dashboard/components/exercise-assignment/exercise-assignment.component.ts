import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TemplateLibraryDialogComponent } from './template-library-dialog/template-library-dialog.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    restTime: number;
    notes: string;
  }[];
  createdBy: string;
  createdAt: Date;
}

interface ExerciseAssignment {
  clientId: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    restTime: number;
    notes: string;
  }[];
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-exercise-assignment',
  templateUrl: './exercise-assignment.component.html',
  styleUrls: ['./exercise-assignment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    SidebarComponent
  ],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden',
        padding: '0',
        margin: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1',
        overflow: 'visible',
        padding: '1rem 0',
        margin: '0.5rem 0 1.5rem'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class ExerciseAssignmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  exerciseForm: FormGroup;
  exercises: Exercise[] = [
    {
      id: '1',
      name: 'Bench Press',
      gifUrl: 'https://tenor.com/view/bench-press-gif-26543726',
      target: 'Chest',
      equipment: 'Barbell',
      bodyPart: 'Chest'
    },
    {
      id: '2',
      name: 'Squats',
      gifUrl: 'https://tenor.com/view/squat-exercise-workout-gif-26543727',
      target: 'Legs',
      equipment: 'Barbell',
      bodyPart: 'Upper Legs'
    },
    {
      id: '3',
      name: 'Deadlift',
      gifUrl: 'https://tenor.com/view/deadlift-exercise-workout-gif-26543728',
      target: 'Back',
      equipment: 'Barbell',
      bodyPart: 'Back'
    },
    {
      id: '4',
      name: 'Pull-ups',
      gifUrl: 'https://tenor.com/view/pullup-exercise-workout-gif-26543729',
      target: 'Back',
      equipment: 'Body Weight',
      bodyPart: 'Back'
    },
    {
      id: '5',
      name: 'Push-ups',
      gifUrl: 'https://tenor.com/view/pushup-exercise-workout-gif-26543730',
      target: 'Chest',
      equipment: 'Body Weight',
      bodyPart: 'Chest'
    },
    {
      id: '6',
      name: 'Lunges',
      gifUrl: 'https://tenor.com/view/lunge-exercise-workout-gif-26543731',
      target: 'Legs',
      equipment: 'Body Weight',
      bodyPart: 'Upper Legs'
    },
    {
      id: '7',
      name: 'Shoulder Press',
      gifUrl: 'https://tenor.com/view/shoulder-press-exercise-workout-gif-26543732',
      target: 'Shoulders',
      equipment: 'Dumbbell',
      bodyPart: 'Shoulders'
    },
    {
      id: '8',
      name: 'Bicep Curls',
      gifUrl: 'https://tenor.com/view/incline-biceps-curl-gif-27366492',
      target: 'Biceps',
      equipment: 'Dumbbell',
      bodyPart: 'Upper Arms'
    }
  ];
  isLoading = false;
  selectedExercise: Exercise | null = null;
  isSidebarCollapsed = false;

  constructor() {
    this.exerciseForm = this.fb.group({
      clientId: [''],
      exerciseId: [''],
      sets: [3, [Validators.min(1)]],
      reps: [12, [Validators.min(1)]],
      restTime: [60, [Validators.min(0)]],
      notes: [''],
      startDate: [new Date()],
      endDate: [new Date(new Date().setDate(new Date().getDate() + 7))]
    });
  }

  ngOnInit(): void {
    // No need to load exercises as they are now static
  }

  onExerciseSelect(exerciseId: string): void {
    this.selectedExercise = this.exercises.find(ex => ex.id === exerciseId) || null;
    if (this.selectedExercise) {
      // Remove any existing Tenor embed script
      const existingScript = document.querySelector('script[src="https://tenor.com/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Load Tenor embed script
      setTimeout(() => {
        const script = document.createElement('script');
        script.src = 'https://tenor.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
      }, 100);
    }
  }

  onSubmit(): void {
    if (this.exerciseForm.valid) {
      const assignment: ExerciseAssignment = {
        clientId: this.exerciseForm.value.clientId,
        exercises: [{
          exerciseId: this.exerciseForm.value.exerciseId,
          sets: this.exerciseForm.value.sets,
          reps: this.exerciseForm.value.reps,
          restTime: this.exerciseForm.value.restTime,
          notes: this.exerciseForm.value.notes
        }],
        startDate: this.exerciseForm.value.startDate,
        endDate: this.exerciseForm.value.endDate
      };

      // Here you would typically send the assignment to your backend
      console.log('Exercise assignment:', assignment);
      
      // Get the selected exercise and client names
      const selectedExercise = this.exercises.find(ex => ex.id === this.exerciseForm.value.exerciseId);
      const selectedClient = this.exerciseForm.value.clientId === 'client1' ? 'ahmed mrabet' : 'Jane Smith';

      // Show success dialog
      this.dialog.open(SuccessDialogComponent, {
        width: '400px',
        data: {
          exerciseName: selectedExercise?.name,
          clientName: selectedClient,
          startDate: this.exerciseForm.value.startDate,
          endDate: this.exerciseForm.value.endDate
        },
        panelClass: 'success-dialog'
      });

      // Reset form after successful assignment
      this.exerciseForm.reset();
      this.selectedExercise = null;
    }
  }

  openQuickAssign(): void {
    // TODO: Implement quick assign dialog
    this.snackBar.open('Quick assign feature coming soon!', 'Close', {
      duration: 3000
    });
  }

  openTemplateLibrary(): void {
    const dialogRef = this.dialog.open(TemplateLibraryDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'template-library-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((template: WorkoutTemplate | undefined) => {
      if (template) {
        // Apply the first exercise from the template
        const firstExercise = template.exercises[0];
        this.exerciseForm.patchValue({
          exerciseId: firstExercise.exerciseId,
          sets: firstExercise.sets,
          reps: firstExercise.reps,
          restTime: firstExercise.restTime,
          notes: firstExercise.notes
        });

        // Find and set the selected exercise
        this.selectedExercise = this.exercises.find(ex => ex.id === firstExercise.exerciseId) || null;

        this.snackBar.open(`Template "${template.name}" applied successfully!`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  onCancel(): void {
    this.exerciseForm.reset();
    this.selectedExercise = null;
  }

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
} 