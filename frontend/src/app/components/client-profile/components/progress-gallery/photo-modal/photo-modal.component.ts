import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressPhoto } from '../progress-gallery.component';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="photo-modal">
      <div class="modal-content">
        <button class="close-btn" mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
        
        <div class="modal-image">
          <img [src]="data.imageUrl" [alt]="data.category">
        </div>
        
        <div class="modal-info">
          <div class="info-header">
            <div class="info-title">
              <mat-icon>photo_camera</mat-icon>
              <h3>{{ data.category | titlecase }} Photo</h3>
            </div>
            <div class="info-date">
              {{ data.date | date:'mediumDate' }}
            </div>
          </div>
          
          <div class="info-details">
            <div class="info-row">
              <mat-icon>scale</mat-icon>
              <span>Weight: {{ data.weight }} kg</span>
            </div>
            
            <div class="info-row notes" *ngIf="data.notes">
              <mat-icon>note</mat-icon>
              <span>{{ data.notes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .photo-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 0;
      backdrop-filter: blur(5px);
      overflow: hidden;
    }

    .modal-content {
      position: relative;
      width: 90%;
      max-width: 1000px;
      height: 80vh;
      max-height: 80vh;
      background: #2d2d2d;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      margin: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 1;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: rotate(90deg);
      }

      mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .modal-image {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .modal-info {
      padding: 1.5rem;
      background: rgba(0, 0, 0, 0.5);
      max-height: 30vh;
      overflow-y: auto;

      .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .info-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          mat-icon {
            color: #e94560;
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }

          h3 {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 500;
            color: #fff;
          }
        }

        .info-date {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
      }

      .info-details {
        margin-bottom: 1.5rem;

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;

          &:last-child {
            margin-bottom: 0;
          }

          mat-icon {
            color: #e94560;
            font-size: 1.25rem;
            width: 1.25rem;
            height: 1.25rem;
          }

          &.notes {
            align-items: flex-start;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
      }
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        height: 90vh;
        max-height: 90vh;

        .modal-image {
          max-height: 60vh;
        }

        .modal-info {
          padding: 1rem;
          max-height: 30vh;
        }
      }
    }
  `]
})
export class PhotoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProgressPhoto
  ) {}

  close(): void {
    this.dialogRef.close();
  }
} 