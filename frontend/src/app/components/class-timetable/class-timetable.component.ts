import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-timetable.component.html',
  styleUrls: ['./class-timetable.component.scss']
})
export class ClassTimetableComponent {
  timeSlots = [
    { time: '6.00am - 8.00am', classes: [
      { day: 'Monday', name: 'WEIGHT LOOSE', trainer: 'RLefew D. Loee', type: 'workout', dark: true },
      { day: 'Tuesday', name: 'Cardio', trainer: 'RLefew D. Loee', type: 'fitness', dark: false },
      { day: 'Wednesday', name: 'Yoga', trainer: 'Keaf Shen', type: 'workout', dark: true },
      { day: 'Thursday', name: 'Fitness', trainer: 'Kimberly Stone', type: 'fitness', dark: false },
      { day: 'Friday', name: '', trainer: '', type: '', dark: true },
      { day: 'Saturday', name: 'Boxing', trainer: 'Rachel Adam', type: 'motivation', dark: false },
      { day: 'Sunday', name: 'Body Building', trainer: 'Robert Cage', type: 'workout', dark: true }
    ]},
    { time: '10.00am - 12.00am', classes: [
      { day: 'Monday', name: '', trainer: '', type: '', dark: false },
      { day: 'Tuesday', name: 'Fitness', trainer: 'Kimberly Stone', type: 'fitness', dark: true },
      { day: 'Wednesday', name: 'WEIGHT LOOSE', trainer: 'RLefew D. Loee', type: 'workout', dark: false },
      { day: 'Thursday', name: 'Cardio', trainer: 'RLefew D. Loee', type: 'motivation', dark: true },
      { day: 'Friday', name: 'Body Building', trainer: 'Robert Cage', type: 'workout', dark: false },
      { day: 'Saturday', name: 'Karate', trainer: 'Donald Grey', type: 'motivation', dark: true },
      { day: 'Sunday', name: '', trainer: '', type: '', dark: false }
    ]},
    { time: '5.00pm - 7.00pm', classes: [
      { day: 'Monday', name: 'Boxing', trainer: 'Rachel Adam', type: 'fitness', dark: true },
      { day: 'Tuesday', name: 'Karate', trainer: 'Donald Grey', type: 'motivation', dark: false },
      { day: 'Wednesday', name: 'Body Building', trainer: 'Robert Cage', type: 'workout', dark: true },
      { day: 'Thursday', name: '', trainer: '', type: '', dark: false },
      { day: 'Friday', name: 'Yoga', trainer: 'Keaf Shen', type: 'workout', dark: true },
      { day: 'Saturday', name: 'Cardio', trainer: 'RLefew D. Loee', type: 'motivation', dark: false },
      { day: 'Sunday', name: 'Fitness', trainer: 'Kimberly Stone', type: 'fitness', dark: true }
    ]},
    { time: '7.00pm - 9.00pm', classes: [
      { day: 'Monday', name: 'Cardio', trainer: 'RLefew D. Loee', type: 'motivation', dark: false },
      { day: 'Tuesday', name: '', trainer: '', type: '', dark: true },
      { day: 'Wednesday', name: 'Boxing', trainer: 'Rachel Adam', type: 'fitness', dark: false },
      { day: 'Thursday', name: 'Yoga', trainer: 'Keaf Shen', type: 'workout', dark: true },
      { day: 'Friday', name: 'Karate', trainer: 'Donald Grey', type: 'motivation', dark: false },
      { day: 'Saturday', name: 'Boxing', trainer: 'Rachel Adam', type: 'fitness', dark: true },
      { day: 'Sunday', name: 'WEIGHT LOOSE', trainer: 'RLefew D. Loee', type: 'workout', dark: false }
    ]}
  ];

  activeFilter = 'all';

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  isClassVisible(type: string): boolean {
    return this.activeFilter === 'all' || this.activeFilter === type;
  }
} 