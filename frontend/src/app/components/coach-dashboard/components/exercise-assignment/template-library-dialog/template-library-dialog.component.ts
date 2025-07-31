import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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

@Component({
  selector: 'app-template-library-dialog',
  templateUrl: './template-library-dialog.component.html',
  styleUrls: ['./template-library-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class TemplateLibraryDialogComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<TemplateLibraryDialogComponent>);

  templates: WorkoutTemplate[] = [
    {
      id: '1',
      name: 'Upper Body Power',
      description: 'A comprehensive upper body workout focusing on strength and power',
      exercises: [
        {
          exerciseId: 'bench-press',
          sets: 4,
          reps: 8,
          restTime: 90,
          notes: 'Focus on explosive movement'
        },
        {
          exerciseId: 'pull-ups',
          sets: 4,
          reps: 10,
          restTime: 90,
          notes: 'Full range of motion'
        },
        {
          exerciseId: 'shoulder-press',
          sets: 3,
          reps: 12,
          restTime: 60,
          notes: 'Keep core tight'
        }
      ],
      createdBy: 'Coach Smith',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Lower Body Strength',
      description: 'Build lower body strength with compound movements',
      exercises: [
        {
          exerciseId: 'squat',
          sets: 5,
          reps: 5,
          restTime: 120,
          notes: 'Maintain proper form'
        },
        {
          exerciseId: 'deadlift',
          sets: 4,
          reps: 6,
          restTime: 120,
          notes: 'Keep back straight'
        },
        {
          exerciseId: 'lunges',
          sets: 3,
          reps: 12,
          restTime: 60,
          notes: 'Controlled movement'
        }
      ],
      createdBy: 'Coach Johnson',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Core & Stability',
      description: 'Improve core strength and overall stability',
      exercises: [
        {
          exerciseId: 'plank',
          sets: 3,
          reps: 1,
          restTime: 60,
          notes: 'Hold for 60 seconds'
        },
        {
          exerciseId: 'russian-twists',
          sets: 3,
          reps: 20,
          restTime: 45,
          notes: 'Use medicine ball'
        },
        {
          exerciseId: 'leg-raises',
          sets: 3,
          reps: 15,
          restTime: 45,
          notes: 'Controlled descent'
        }
      ],
      createdBy: 'Coach Williams',
      createdAt: new Date('2024-01-25')
    },
    {
      id: '4',
      name: 'Full Body HIIT',
      description: 'High-intensity interval training for full body conditioning',
      exercises: [
        {
          exerciseId: 'burpees',
          sets: 4,
          reps: 15,
          restTime: 30,
          notes: 'Explosive movement'
        },
        {
          exerciseId: 'mountain-climbers',
          sets: 4,
          reps: 20,
          restTime: 30,
          notes: 'Fast pace'
        },
        {
          exerciseId: 'jump-squats',
          sets: 4,
          reps: 15,
          restTime: 30,
          notes: 'Land softly'
        }
      ],
      createdBy: 'Coach Davis',
      createdAt: new Date('2024-01-30')
    },
    {
      id: '5',
      name: 'Push-Pull Split',
      description: 'Classic push-pull workout for balanced development',
      exercises: [
        {
          exerciseId: 'push-ups',
          sets: 4,
          reps: 15,
          restTime: 60,
          notes: 'Full range of motion'
        },
        {
          exerciseId: 'rows',
          sets: 4,
          reps: 12,
          restTime: 60,
          notes: 'Squeeze shoulder blades'
        },
        {
          exerciseId: 'dips',
          sets: 3,
          reps: 10,
          restTime: 60,
          notes: 'Controlled movement'
        }
      ],
      createdBy: 'Coach Brown',
      createdAt: new Date('2024-02-01')
    }
  ];

  isLoading = false;
  selectedTemplate: WorkoutTemplate | null = null;

  constructor() {
    // Simulate loading delay
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onTemplateSelect(template: WorkoutTemplate): void {
    this.selectedTemplate = template;
  }

  onApplyTemplate(): void {
    if (this.selectedTemplate) {
      this.dialogRef.close(this.selectedTemplate);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 