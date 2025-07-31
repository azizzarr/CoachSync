import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Activity } from '../timeline-activity/timeline-activity.component';
import { TimelineActivityComponent } from '../timeline-activity/timeline-activity.component';

@Component({
  selector: 'app-activity-timeline-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TimelineActivityComponent
  ],
  template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2>Activity Timeline</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="modal-content">
        <app-timeline-activity [activities]="activities"></app-timeline-activity>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      background: #1a1a2e;
      border-radius: 16px;
      padding: 24px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      h2 {
        margin: 0;
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
      }

      button {
        color: rgba(255, 255, 255, 0.7);
        transition: all 0.3s ease;

        &:hover {
          color: white;
          transform: rotate(90deg);
        }
      }
    }

    .modal-content {
      overflow-y: auto;
      padding-right: 16px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
    }
  `]
})
export class ActivityTimelineModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ActivityTimelineModalComponent>,
    @Inject(MAT_DIALOG_DATA) public activities: Activity[]
  ) {}

  close(): void {
    this.dialogRef.close();
  }
} 