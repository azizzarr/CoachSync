import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

type TimeFrame = 'week' | 'month' | 'year';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './stats-grid.component.html',
  styleUrls: ['./stats-grid.component.scss']
})
export class StatsGridComponent {
  @Input() goals: any[] = [];
  @Input() selectedTimeFrame: TimeFrame = 'week';
  @Output() timeFrameChange = new EventEmitter<TimeFrame>();

  timeFrames: TimeFrame[] = ['week', 'month', 'year'];

  stats = {
    workouts: 12,
    duration: '6h 30m',
    calories: '2,450'
  };

  onTimeFrameChange(timeFrame: TimeFrame): void {
    this.timeFrameChange.emit(timeFrame);
  }
} 