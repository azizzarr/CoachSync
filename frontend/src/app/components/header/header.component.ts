import { Component, OnInit, HostListener, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  isLoggedIn = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (window.innerWidth > 991 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.enableScrolling();
    }
  }

  ngOnInit() {
    this.onWindowScroll();
    // Subscribe to auth state changes
    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.isDropdownOpen = false;
      this.enableScrolling();
    } else {
      this.disableScrolling();
    }
  }

  enableScrolling() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
  }

  disableScrolling() {
    // Store the current scroll position
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.height = '100%';
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  async logout() {
    try {
      await this.authService.signOut();
      // Show logout message
      this.snackBar.open('You have been successfully logged out', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
      // Close mobile menu if open
      if (this.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
    } catch (error) {
      console.error('Logout error:', error);
      this.snackBar.open('Error logging out. Please try again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    }
  }

  onCoachDashboardClick(event: Event) {
    event.preventDefault();
    
    // Show professional alert dialog
    this.showAccessRestrictionDialog();
    
    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  private showAccessRestrictionDialog() {
    // Create a custom alert dialog
    const dialogRef = this.dialog.open(AccessRestrictionDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'access-restriction-dialog',
      data: {
        title: 'Access Restricted',
        message: 'Only coaches are allowed to access the Coach Dashboard. Please contact your administrator if you believe this is an error.',
        icon: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Dialog closed
    });
  }
}

// Custom Dialog Component
@Component({
  selector: 'app-access-restriction-dialog',
  template: `
    <div class="access-restriction-dialog">
      <div class="dialog-header">
        <div class="icon-container">
          <i class="fa fa-exclamation-triangle"></i>
        </div>
        <h2>{{data.title}}</h2>
      </div>
      <div class="dialog-content">
        <p>{{data.message}}</p>
      </div>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="onClose()" class="close-button">
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    .access-restriction-dialog {
      padding: 0;
      border-radius: 14px;
      overflow: hidden;
      background: #232526;
      box-shadow: 0 8px 32px rgba(243, 97, 0, 0.15);
      border: 1.5px solid #ff6b35;
    }

    .dialog-header {
      background: linear-gradient(135deg, #f36100 0%, #ff6b35 100%);
      color: #e0e0e0;
      padding: 2rem 1.5rem 1.25rem 1.5rem;
      text-align: center;
      position: relative;

      .icon-container {
        margin-bottom: 1rem;

        i {
          font-size: 3rem;
          color: #e0e0e0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }
      }

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
        letter-spacing: 0.5px;
      }
    }

    .dialog-content {
      padding: 2rem 1.5rem;
      background: #232526;
      text-align: center;

      p {
        margin: 0;
        font-size: 1.08rem;
        line-height: 1.7;
        color: #e0e0e0;
        letter-spacing: 0.1px;
      }
    }

    .dialog-actions {
      padding: 1.5rem 2rem 2rem;
      background: #232526;
      text-align: center;
      border-top: 1px solid #292929;

      .close-button {
        background: linear-gradient(135deg, #f36100 0%, #ff6b35 100%);
        color: #e0e0e0;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s cubic-bezier(.4,0,.2,1);
        min-width: 120px;
        box-shadow: 0 2px 8px rgba(243, 97, 0, 0.10);

        &:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 18px rgba(243, 97, 0, 0.18);
          background: linear-gradient(135deg, #ff6b35 0%, #f36100 100%);
        }
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, MatDialogModule]
})
export class AccessRestrictionDialogComponent {
  constructor(
    public dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.closeAll();
  }
}
