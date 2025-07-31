import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  CalendarOptions, 
  EventInput, 
  EventClickArg, 
  EventDropArg,
  DateSelectArg
} from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SessionFormComponent } from './session-form/session-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCalendarDay, 
  faUsers, 
  faClock,
  faArrowUp,
  faArrowDown,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  clientId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  description?: string;
  location?: string;
  duration: number;
}

interface SessionFormData {
  title: string;
  start: Date;
  end: Date;
  clientId: string;
  description?: string;
  location?: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    SessionFormComponent,
    FontAwesomeModule,
    SidebarComponent
  ]
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendar: any;
  
  // Make Math available in template
  Math = Math;
  
  // Add icon properties
  faCalendarDay = faCalendarDay;
  faUsers = faUsers;
  faClock = faClock;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faPlus = faPlus;
  
  // Calendar properties
  isSidebarCollapsed = false;
  isLoading = false;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    views: {
      timeGridDay: {
        slotDuration: '00:30:00',
        slotLabelInterval: '00:30:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }
      },
      timeGridWeek: {
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }
      },
      dayGridMonth: {
        fixedWeekCount: false,
        showNonCurrentDates: true
      }
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventDidMount: (info) => {
      const status = info.event.extendedProps['status'];
      if (status) {
        info.el.style.backgroundColor = this.getEventColor(status);
        info.el.style.borderColor = this.getEventColor(status);
      }
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 'auto',
    expandRows: true,
    stickyHeaderDates: true,
    nowIndicator: true,
    navLinks: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      startTime: '06:00',
      endTime: '22:00',
    },
    contentHeight: 'auto',
    aspectRatio: 1.5,
    // Mobile-specific options
    windowResize: () => {
      this.handleWindowResize();
    }
  };

  // Informational cards properties
  todaySessionsCount = 0;
  sessionsTrend = 0;
  activeClientsCount = 0;
  clientsTrend = 0;
  averageSessionDuration = 0;
  durationTrend = 0;

  sessions: Session[] = [
    {
      id: '1',
      title: 'Morning Session',
      start: new Date(2024, 3, 15, 9, 0),
      end: new Date(2024, 3, 15, 10, 0),
      clientId: 'client1',
      status: 'scheduled',
      description: 'Personal training session',
      location: 'Main Gym',
      duration: 60
    },
    {
      id: '2',
      title: 'Evening Session',
      start: new Date(2024, 3, 15, 17, 0),
      end: new Date(2024, 3, 15, 18, 0),
      clientId: 'client2',
      status: 'scheduled',
      description: 'Group training session',
      location: 'Group Room',
      duration: 60
    }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.calculateStats();
    this.handleWindowResize();
    window.addEventListener('resize', () => this.handleWindowResize());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.handleWindowResize());
  }

  private loadSessions(): void {
    this.isLoading = true;
    try {
      this.calendarOptions.events = this.sessions.map(session => ({
        id: session.id,
        title: session.title,
        start: session.start,
        end: session.end,
        backgroundColor: this.getEventColor(session.status),
        borderColor: this.getEventColor(session.status),
        extendedProps: {
          description: session.description,
          location: session.location,
          clientId: session.clientId
        }
      }));
    } catch (error) {
      this.showError('Failed to load sessions');
    } finally {
      this.isLoading = false;
    }
  }

  private calculateStats(): void {
    // Calculate today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.todaySessionsCount = this.sessions.filter(session => {
      const sessionDate = new Date(session.start);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    }).length;

    // Calculate active clients
    this.activeClientsCount = new Set(this.sessions.map(session => session.clientId)).size;

    // Calculate average session duration
    const totalDuration = this.sessions.reduce((acc, session) => {
      return acc + (new Date(session.end).getTime() - new Date(session.start).getTime());
    }, 0);
    this.averageSessionDuration = Math.round(totalDuration / (this.sessions.length * 60000));

    // Set sample trends (in a real app, these would be calculated)
    this.sessionsTrend = 15;
    this.clientsTrend = 8;
    this.durationTrend = 5;
  }

  openSessionForm(session?: Session | SessionFormData): void {
    const dialogRef = this.dialog.open(SessionFormComponent, {
      width: '500px',
      data: session,
      panelClass: 'session-form-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (session && 'id' in session) {
          this.updateSession(result);
        } else {
          this.createSession(result);
        }
      }
    });
  }

  private createSession(data: SessionFormData): void {
    const newSession: Session = {
      ...data,
      id: Date.now().toString(),
      status: 'scheduled',
      duration: 60
    };
    
    this.sessions.push(newSession);
    this.loadSessions();
    this.calculateStats();
    this.showSuccess('Session created successfully');
  }

  private updateSession(session: Session): void {
    try {
      const index = this.sessions.findIndex(s => s.id === session.id);
      if (index !== -1) {
        this.sessions[index] = { ...this.sessions[index], ...session };
        this.loadSessions();
        this.calculateStats();
        this.showSuccess('Session updated successfully');
      } else {
        this.showError('Session not found');
      }
    } catch (error) {
      this.showError('Failed to update session');
    }
  }

  private getEventColor(status: Session['status']): string {
    switch (status) {
      case 'scheduled':
        return '#6366f1';
      case 'completed':
        return '#22c55e';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6366f1';
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  onSidebarToggle(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }

  private handleDateSelect(arg: DateSelectArg) {
    const formData: SessionFormData = {
      title: '',
      start: arg.start,
      end: new Date(arg.start.getTime() + 60 * 60 * 1000), // Default 1 hour duration
      clientId: ''
    };
    this.openSessionForm(formData);
  }

  private handleEventClick(clickInfo: EventClickArg) {
    const session = this.sessions.find(s => s.id === clickInfo.event.id);
    if (session) {
      this.openSessionForm(session);
    }
  }

  private handleEventDrop(dropInfo: EventDropArg) {
    const session = this.sessions.find(s => s.id === dropInfo.event.id);
    if (session) {
      session.start = dropInfo.event.start!;
      session.end = dropInfo.event.end!;
      this.updateSession(session);
    }
  }

  private handleEventResize(info: EventResizeDoneArg) {
    const sessionId = info.event.id;
    const session = this.sessions.find(s => s.id === sessionId);
    
    if (session) {
      const updatedSession: Session = {
        ...session,
        start: info.event.start!,
        end: info.event.end!,
        duration: this.calculateDuration(info.event.start!, info.event.end!)
      };
      
      this.updateSession(updatedSession);
    }
  }

  private calculateDuration(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  private handleWindowResize(): void {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    if (isSmallMobile) {
      this.calendarOptions.headerToolbar = {
        left: 'prev,next',
        center: 'title',
        right: ''
      };
    } else if (isMobile) {
      this.calendarOptions.headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      };
    } else {
      this.calendarOptions.headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      };
    }

    // Update calendar view if needed
    if (this.calendar) {
      this.calendar.getApi().render();
    }
  }
} 