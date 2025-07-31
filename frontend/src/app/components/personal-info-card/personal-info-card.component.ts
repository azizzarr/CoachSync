import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-personal-info-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="info-card">
      <mat-card-header>
        <mat-card-title>Personal Information</mat-card-title>
        <button mat-icon-button (click)="onEdit()">
          <mat-icon>edit</mat-icon>
        </button>
      </mat-card-header>
      <mat-card-content>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">
              <mat-icon>cake</mat-icon>
            </div>
            <div class="info-content">
              <span class="label">Age</span>
              <span class="value">{{ clientInfo.age }} years</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <mat-icon>height</mat-icon>
            </div>
            <div class="info-content">
              <span class="label">Height</span>
              <span class="value">{{ clientInfo.height }} cm</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <mat-icon>monitor_weight</mat-icon>
            </div>
            <div class="info-content">
              <span class="label">Weight</span>
              <span class="value">{{ clientInfo.weight }} kg</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="info-content">
              <span class="label">Next Session</span>
              <span class="value">{{ clientInfo.nextSession }}</span>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .info-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      padding: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .info-icon {
      width: 40px;
      height: 40px;
      background: rgba(26, 35, 126, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        color: #1a237e;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 12px;
      color: #6c757d;
    }

    .value {
      font-size: 16px;
      font-weight: 500;
      color: #1a237e;
    }
  `]
})
export class PersonalInfoCardComponent {
  @Input() clientInfo: any;
  @Output() edit = new EventEmitter<void>();

  onEdit() {
    this.edit.emit();
  }
} 