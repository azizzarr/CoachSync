import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ClassTimetableComponent } from '../class-timetable/class-timetable.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ClassTimetableComponent
  ],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  showSearch = false;

  constructor() {}

  ngOnInit(): void {
    // Initialize any necessary data or configurations
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    // Implement search functionality
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }
}
