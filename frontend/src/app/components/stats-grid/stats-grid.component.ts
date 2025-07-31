import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">
            <mat-icon>fitness_center</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.workouts }}</span>
            <span class="stat-label">Workouts</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <mat-icon>timer</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.minutes }}</span>
            <span class="stat-label">Minutes</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <mat-icon>local_fire_department</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.calories }}</span>
            <span class="stat-label">Calories</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-section {
      padding: 24px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      margin-top: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: white;
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: white;
    }

    .stat-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }
  `]
})
export class StatsGridComponent {
  @Input() stats: any;
} 