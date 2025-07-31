import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

interface SuccessDialogData {
  exerciseName: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="success-dialog">
      <div class="success-icon">
        <mat-icon>check_circle</mat-icon>
      </div>
      <h2>Exercise Assigned Successfully!</h2>
      <div class="assignment-details">
        <p><strong>{{data.exerciseName}}</strong> has been assigned to <strong>{{data.clientName}}</strong></p>
        <div class="date-range">
          <p>From: {{data.startDate | date:'mediumDate'}}</p>
          <p>To: {{data.endDate | date:'mediumDate'}}</p>
        </div>
      </div>
      <div class="dialog-actions">
        <button mat-flat-button color="primary" (click)="dialogRef.close()">
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      padding: 2rem;
      text-align: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      border-radius: 16px;
      border: 1px solid rgba(251, 146, 60, 0.2);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }
    }

    .success-icon {
      margin-bottom: 1rem;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #fb923c;
      }
    }

    h2 {
      margin: 0 0 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .assignment-details {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: rgba(251, 146, 60, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(251, 146, 60, 0.1);

      p {
        margin: 0.5rem 0;
        font-size: 1rem;
        color: #e2e8f0;

        strong {
          color: #fb923c;
        }
      }

      .date-range {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(251, 146, 60, 0.2);

        p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          color: #94a3b8;
        }
      }
    }

    .dialog-actions {
      button {
        min-width: 120px;
        padding: 0.5rem 1.5rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
        color: white;
        border: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
        }
      }
    }
  `]
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuccessDialogData
  ) {}
} 