import { Component, OnInit, ViewChild, ChangeDetectionStrategy, AfterViewInit, ElementRef, NgZone, OnDestroy, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faEllipsisVertical, 
  faSearch,
  faFilter,
  faUser,
  faEdit,
  faTrash,
  faArrowUp,
  faArrowDown,
  faUsers,
  faUserCheck,
  faUserClock,
  faUserSlash,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BehaviorSubject, Subject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, throttleTime, map, startWith, switchMap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  plan: string;
  nextSession: Date | null;
  progress: number;
  avatar: string;
  memberSince: Date;
}

interface StatusColors {
  active: string;
  inactive: string;
  pending: string;
}

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
    FontAwesomeModule,
    FormsModule,
    SidebarComponent,
    ScrollingModule
  ],

  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientTableComponent implements OnInit, AfterViewInit, OnDestroy {
  // Icons
  faEllipsisVertical = faEllipsisVertical;
  faSearch = faSearch;
  faFilter = faFilter;
  faUser = faUser;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faUsers = faUsers;
  faUserCheck = faUserCheck;
  faUserClock = faUserClock;
  faUserSlash = faUserSlash;
  faEye = faEye;

  // Sidebar state
  isSidebarCollapsed = false;

  displayedColumns: string[] = [
    'avatar',
    'name',
    'email',
    'phone',
    'status',
    'plan',
    'nextSession',
    'progress',
    'memberSince',
    'actions'
  ];

  clients: ClientData[] = [
    {
      id: '1',
      name: 'Samir pesiron',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      plan: 'Premium',
      nextSession: new Date('2024-03-20'),
      progress: 75,
      avatar: 'assets/avatars/1.jpg',
      memberSince: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      status: 'pending',
      plan: 'Basic',
      nextSession: new Date('2024-03-21'),
      progress: 45,
      avatar: 'assets/avatars/2.jpg',
      memberSince: new Date('2023-06-20')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 (555) 345-6789',
      status: 'inactive',
      plan: 'Standard',
      nextSession: new Date('2024-03-22'),
      progress: 20,
      avatar: 'assets/avatars/3.jpg',
      memberSince: new Date('2023-03-10')
    }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ClientData>;
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;

  private destroy$ = new Subject<void>();
  public searchSubject = new BehaviorSubject<string>('');
  private resizeObserver: ResizeObserver;
  
  isLoading = false;
  isMobile = window.innerWidth < 768;
  itemSize = 56; // Height of each row
  virtualItemSize = 56; // Virtual scroll item size

  searchTerm: string = '';
  currentFilter: 'all' | 'active' | 'inactive' | 'pending' = 'all';
  filteredClients: ClientData[] = [];

  private readonly statusColors: StatusColors = {
    active: '#10b981',
    inactive: '#ef4444',
    pending: '#f59e0b'
  } as const;

  // Client statistics
  totalClients: number = 0;
  activeClients: number = 0;
  pendingClients: number = 0;
  inactiveClients: number = 0;

  // Optimize trackBy function
  trackByClientId: TrackByFunction<ClientData> = (index: number, client: ClientData) => client.id;

  // Use signals for reactive state
  private readonly clientsSignal = new BehaviorSubject<ClientData[]>([]);
  clients$: Observable<ClientData[]> = this.clientsSignal.asObservable();

  // Optimize data source with virtual scrolling
  dataSource: MatTableDataSource<ClientData>;
  isTableScrollable = false;

  // Add selection model for bulk actions
  selection = new SelectionModel<ClientData>(true, []);
  
  // Add export options
  exportFormats = [
    { value: 'xlsx', label: 'Excel (.xlsx)' },
    { value: 'csv', label: 'CSV (.csv)' },
    { value: 'json', label: 'JSON (.json)' }
  ];

  // Add bulk action options
  bulkActions = [
    { value: 'activate', label: 'Activate Selected' },
    { value: 'deactivate', label: 'Deactivate Selected' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  exampleClients: ClientData[] = [];

  constructor(
    private ngZone: NgZone,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<ClientData>([]);
    this.setupFilterPredicate();
    
    // Initialize ResizeObserver with optimized callback
    this.resizeObserver = new ResizeObserver(entries => {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
      this.ngZone.run(() => {
        this.isMobile = window.innerWidth < 768;
        this.checkTableScroll();
          });
        });
      });
    });
  }

  ngOnInit(): void {
    this.initializeExampleData();
    this.dataSource = new MatTableDataSource<ClientData>(this.exampleClients);
    this.setupSearch();
    this.setupVirtualScroll();
    this.calculateClientStatistics();
  }

  ngAfterViewInit(): void {
    this.setupTable();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resizeObserver.disconnect();
  }

  private initializeData(): void {
    // Simulate API call with optimized data loading
    this.isLoading = true;
    setTimeout(() => {
      this.clientsSignal.next(this.clients);
      this.dataSource.data = this.clients;
      this.calculateClientStatistics();
      this.isLoading = false;
    }, 0);
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.dataSource.filter = searchTerm.trim().toLowerCase();
    });
  }

  private setupVirtualScroll(): void {
    if (this.virtualScroll) {
      this.virtualScroll.scrolledIndexChange
        .pipe(
          throttleTime(100),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          // Handle virtual scroll events
        });
    }
  }

  private setupTable(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  private setupResizeObserver(): void {
    if (this.tableWrapper?.nativeElement) {
      this.resizeObserver.observe(this.tableWrapper.nativeElement);
    }
  }

  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: ClientData, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchStr) ||
        data.email.toLowerCase().includes(searchStr) ||
        data.phone.toLowerCase().includes(searchStr) ||
        data.status.toLowerCase().includes(searchStr) ||
        data.plan.toLowerCase().includes(searchStr)
      );
    };
  }

  // Add checkTableScroll method
  private checkTableScroll(): void {
    if (this.tableWrapper?.nativeElement) {
      const tableElement = this.tableWrapper.nativeElement;
      const tableHeight = tableElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      this.isTableScrollable = tableHeight > viewportHeight;
    }
  }

  // Optimize sorting with memoization
  private sortData(data: ClientData[]): ClientData[] {
    if (!this.sort?.active || this.sort.direction === '') return data;

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        case 'progress': return compare(a.progress, b.progress, isAsc);
        case 'memberSince': return compare(a.memberSince.getTime(), b.memberSince.getTime(), isAsc);
        default: return 0;
      }
    });
  }

  // Optimize client statistics calculation
  private calculateClientStatistics(): void {
    const clients = this.dataSource.data;
    this.totalClients = clients.length;
    this.activeClients = clients.filter(client => client.status === 'active').length;
    this.pendingClients = clients.filter(client => client.status === 'pending').length;
    this.inactiveClients = clients.filter(client => client.status === 'inactive').length;
  }

  // Optimize table refresh
  private refreshTable(): void {
    this.dataSource.data = [...this.dataSource.data];
    this.calculateClientStatistics();
  }

  filterByStatus(status: 'all' | 'active' | 'inactive' | 'pending'): void {
    this.isLoading = true;
    this.currentFilter = status;
    
    setTimeout(() => {
      this.dataSource.filter = status === 'all'
        ? this.searchTerm.trim().toLowerCase()
        : `${status}:${this.searchTerm.trim().toLowerCase()}`;
      
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      
      this.isLoading = false;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#9ca3af';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#3b82f6';
    if (progress >= 25) return '#f59e0b';
    return '#ef4444';
  }

  onViewProfile(client: ClientData): void {
    // Implement view profile functionality
    console.log('View profile:', client);
  }

  onEditClient(client: ClientData): void {
    // Implement edit client functionality
    console.log('Edit client:', client);
  }

  onDeleteClient(client: ClientData): void {
    // Implement delete client functionality
    console.log('Delete client:', client);
  }

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  // Selection methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  // Export methods
  exportData(format: string) {
    const data = this.selection.selected.length > 0 ? 
      this.selection.selected : 
      this.dataSource.data;

    switch (format) {
      case 'xlsx':
        this.exportToExcel(data);
        break;
      case 'csv':
        this.exportToCsv(data);
        break;
      case 'json':
        this.exportToJson(data);
        break;
    }
  }

  private exportToExcel(data: ClientData[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'clients.xlsx');
  }

  private exportToCsv(data: ClientData[]) {
    const replacer = (key: any, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => 
      JSON.stringify(row[fieldName as keyof ClientData], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'clients.csv');
  }

  private exportToJson(data: ClientData[]) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'clients.json');
  }

  // Bulk actions
  executeBulkAction(action: string) {
    const selectedClients = this.selection.selected;
    
    switch (action) {
      case 'activate':
        this.bulkUpdateStatus(selectedClients, 'active');
        break;
      case 'deactivate':
        this.bulkUpdateStatus(selectedClients, 'inactive');
        break;
      case 'delete':
        this.bulkDeleteClients(selectedClients);
        break;
    }
  }

  private bulkUpdateStatus(clients: ClientData[], status: 'active' | 'inactive' | 'pending') {
    clients.forEach(client => {
      const index = this.dataSource.data.findIndex(c => c.id === client.id);
      if (index !== -1) {
        this.dataSource.data[index].status = status;
      }
    });
    this.refreshTable();
  }

  private bulkDeleteClients(clients: ClientData[]) {
    const clientIds = clients.map(client => client.id);
    this.dataSource.data = this.dataSource.data.filter(client => !clientIds.includes(client.id));
    this.selection.clear();
    this.refreshTable();
  }

  // Performance optimization for virtual scrolling
  getItemSize(): number {
    return this.isMobile ? 48 : 56;
  }

  // Add client quick actions
  quickUpdateStatus(client: ClientData, status: 'active' | 'inactive' | 'pending') {
    const index = this.dataSource.data.findIndex(c => c.id === client.id);
    if (index !== -1) {
      this.dataSource.data[index].status = status;
      this.refreshTable();
    }
  }

  viewClientProfile(clientId: string) {
    this.router.navigate(['/client-profile'], { 
      queryParams: { id: clientId }
    });
  }

  // Add proper event handler
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  private initializeExampleData(): void {
    this.exampleClients = [
      {
        id: 'CL001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 234-567-8901',
        status: 'active',
        plan: 'Premium',
        nextSession: new Date('2024-03-15T10:00:00'),
        progress: 75,
        avatar: 'https://picsum.photos/id/1005/200/200',
        memberSince: new Date('2023-01-15')
      },
      {
        id: 'CL002',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 234-567-8902',
        status: 'active',
        plan: 'Standard',
        nextSession: new Date('2024-03-16T14:30:00'),
        progress: 60,
        avatar: 'https://picsum.photos/id/1012/200/200',
        memberSince: new Date('2023-02-20')
      },
      {
        id: 'CL003',
        name: 'ahmed ahmed',
        email: 'ahmed@gmail.com',
        phone: '+216 95018151',
        status: 'pending',
        plan: 'Basic',
        nextSession: null,
        progress: 30,
        avatar: 'https://picsum.photos/id/1025/200/200',
        memberSince: new Date('2023-03-10')
      },
      {
        id: 'CL004',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '+1 234-567-8904',
        status: 'active',
        plan: 'Premium',
        nextSession: new Date('2024-03-17T09:00:00'),
        progress: 85,
        avatar: 'https://picsum.photos/id/1035/200/200',
        memberSince: new Date('2023-04-05')
      },
      {
        id: 'CL005',
        name: 'David Wilson',
        email: 'd.wilson@example.com',
        phone: '+1 234-567-8905',
        status: 'inactive',
        plan: 'Standard',
        nextSession: null,
        progress: 45,
        avatar: 'https://picsum.photos/id/1040/200/200',
        memberSince: new Date('2023-05-12')
      },
      {
        id: 'CL006',
        name: 'Jessica Taylor',
        email: 'j.taylor@example.com',
        phone: '+1 234-567-8906',
        status: 'active',
        plan: 'Premium',
        nextSession: new Date('2024-03-18T11:30:00'),
        progress: 90,
        avatar: 'https://picsum.photos/id/1045/200/200',
        memberSince: new Date('2023-06-20')
      },
      {
        id: 'CL007',
        name: 'Robert Anderson',
        email: 'r.anderson@example.com',
        phone: '+1 234-567-8907',
        status: 'pending',
        plan: 'Basic',
        nextSession: null,
        progress: 25,
        avatar: 'https://picsum.photos/id/1050/200/200',
        memberSince: new Date('2023-07-15')
      },
      {
        id: 'CL008',
        name: 'Jennifer Martinez',
        email: 'j.martinez@example.com',
        phone: '+1 234-567-8908',
        status: 'active',
        plan: 'Standard',
        nextSession: new Date('2024-03-19T15:00:00'),
        progress: 70,
        avatar: 'https://picsum.photos/id/1055/200/200',
        memberSince: new Date('2023-08-10')
      }
    ];
  }
}

function compare(a: any, b: any, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
} 