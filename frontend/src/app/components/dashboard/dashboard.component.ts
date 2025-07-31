import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil, Observable, of } from 'rxjs';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    HttpClientModule,
    
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userEmail: string | null = null;
  private destroy$ = new Subject<void>();
  idToken: string | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private auth: Auth,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // First check if we already have a user in the BehaviorSubject
    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.authService.getIdToken().then(token => {
          this.idToken = token;
          console.log('Firebase ID Token:', token);
        });
        return;
      }
      
      // If no user is found, check if there's a current user directly from Firebase
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        // Update the auth service with the current user
        this.authService.updateUserState(currentUser);
        this.userEmail = currentUser.email;
        this.authService.getIdToken().then(token => {
          this.idToken = token;
          console.log('Firebase ID Token:', token);
        });
        return;
      }
      
      // If still no user, wait for Firebase to initialize
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        if (user) {
          // Update the auth service with the current user
          this.authService.updateUserState(user);
          this.userEmail = user.email;
          this.authService.getIdToken().then(token => {
            this.idToken = token;
            console.log('Firebase ID Token:', token);
          });
        } else {
          // If still no user, redirect to login
          this.router.navigate(['/login']);
        }
        unsubscribe();
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.signOut();
  }

  navigateToHero() {
    this.router.navigate(['/hero']);
  }

  copyToken() {
    if (this.idToken) {
      navigator.clipboard.writeText(this.idToken).then(() => {
        alert('Token copied to clipboard!');
      });
    }
  }
  testBackend() {
    this.http.get('https://gym-backend-simple-production.up.railway.app/api/public/test', { responseType: 'text' })
    .subscribe({
      next: (response) => {
        this.snackBar.open('Backend Response: ' + response, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error connecting to backend: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.isLoading = false;
      }
    });
   }

  testSecureBackend() {
    this.isLoading = true;
    if (!this.idToken) {
      this.snackBar.open('No authentication token found', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.isLoading = false;
      return;
    }

    this.http.get('https://gym-backend-simple-production.up.railway.app/api/public/secure-test', {
      headers: {
        'Authorization': `Bearer ${this.idToken}`
      },
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.snackBar.open('Secure Backend Response: ' + response, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error connecting to secure backend: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.isLoading = false;
      }
    });
  }
}

