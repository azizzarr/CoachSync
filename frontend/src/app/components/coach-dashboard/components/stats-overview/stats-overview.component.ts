import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUserGroup,
  faCalendarDays,
  faMessage,
  faChartLine,
  faDollarSign,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stats-overview',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsOverviewComponent implements OnInit {
  // Icons
  faUserGroup = faUserGroup;
  faCalendarDays = faCalendarDays;
  faMessage = faMessage;
  faChartLine = faChartLine;
  faDollarSign = faDollarSign;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  // Mock data - replace with actual data from service
  stats = [
    {
      title: 'Active Clients',
      value: '24',
      icon: faUserGroup,
      trend: {
        value: '+12%',
        isPositive: true
      },
      color: '#ff6b35'
    },
    {
      title: 'Today\'s Sessions',
      value: '8',
      icon: faCalendarDays,
      trend: {
        value: '+2',
        isPositive: true
      },
      color: '#2ecc71'
    },
    {
      title: 'Pending Messages',
      value: '5',
      icon: faMessage,
      trend: {
        value: '-3',
        isPositive: true
      },
      color: '#3498db'
    },
    {
      title: 'Client Progress',
      value: '78%',
      icon: faChartLine,
      trend: {
        value: '+5%',
        isPositive: true
      },
      color: '#9b59b6'
    },
    {
      title: 'Monthly Revenue',
      value: '$4,250',
      icon: faDollarSign,
      trend: {
        value: '+15%',
        isPositive: true
      },
      color: '#f1c40f'
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Ensure the component is marked for check after initialization
    this.cdr.markForCheck();
  }
} 