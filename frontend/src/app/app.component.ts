import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { DialogService } from './services/dialog.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PreloaderComponent,
    CommonModule,
    CustomDialogComponent
  ],
  template: `
    <app-preloader *ngIf="isLoading"></app-preloader>
   
    <main [ngClass]="{'hero-page': isHeroPage}">
      <router-outlet></router-outlet>
    </main>
    
    <app-custom-dialog
      [isOpen]="(dialogState$ | async)?.isOpen || false"
      [title]="(dialogState$ | async)?.title || ''"
      [message]="(dialogState$ | async)?.message || ''"
      (closeDialog)="onDialogClose()"
    ></app-custom-dialog>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    main {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .hero-page {
      margin-top: 0;
    }
    main:not(.hero-page) {
      margin-top: 0;
    }
  `]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'GymApp';
  isHeroPage = false;
  isLoading = true;
  dialogState$;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private viewportScroller: ViewportScroller,
    private ngZone: NgZone
  ) {
    this.dialogState$ = this.dialogService.dialogState$;
  }

  ngOnInit() {
    // Handle navigation start
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      // Reset scroll position immediately when navigation starts
      this.scrollToTop();
    });

    // Handle navigation end
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHeroPage = event.url === '/';
      
      // Reset scroll position after navigation ends
      this.scrollToTop();
    });
  }

  ngAfterViewInit() {
    // Hide the preloader after the app is loaded
    setTimeout(() => {
      this.isLoading = false;
    }, 1000); // Show preloader for 1 second minimum
    
    // Additional scroll reset after view initialization
    this.scrollToTop();
  }

  private scrollToTop() {
    // Run outside Angular's zone to ensure it happens immediately
    this.ngZone.runOutsideAngular(() => {
      // Method 1: Using ViewportScroller
      this.viewportScroller.scrollToPosition([0, 0]);
      
      // Method 2: Using window.scrollTo
      window.scrollTo(0, 0);
      
      // Method 3: Using document properties
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      
      // Method 4: Using setTimeout to ensure it happens after view updates
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 0);
      
      // Method 5: Using requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
    });
  }
  
  onDialogClose(): void {
    this.dialogService.closeDialog();
  }
}
