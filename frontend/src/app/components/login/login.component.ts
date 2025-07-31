import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Auth, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private destroy$ = new Subject<void>();
  private emailSubject = new Subject<string>();
  private passwordSubject = new Subject<string>();
  googleAuthEnabled = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: Auth
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Set up debounced email validation
    this.loginForm.get('email')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(email => {
        this.emailSubject.next(email);
        this.clearMessages();
      });

    // Set up debounced password validation
    this.loginForm.get('password')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(password => {
        this.passwordSubject.next(password);
        this.clearMessages();
      });

    // Check if user is already logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.router.navigate(['/dashboard']);
    }

    // Check if Google Auth is enabled
    this.googleAuthEnabled = this.authService.isGoogleAuthEnabled();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.clearMessages();
      this.cdr.detectChanges();
      
      // Disable form controls when loading
      this.loginForm.disable();

      const { email, password } = this.loginForm.value;

      // First set persistence
      setPersistence(this.auth, browserLocalPersistence)
        .then(() => {
          // Then sign in
          return this.authService.signIn(email, password);
        })
        .then(async (userCredential) => {
          // Get and store the token
          const token = await userCredential.user.getIdToken();
          localStorage.setItem('token', token);
          
          // Store user data
          localStorage.setItem('user', JSON.stringify({
            email: userCredential.user.email,
            uid: userCredential.user.uid
          }));
          
          this.handleLoginSuccess();
        })
        .catch((error) => {
          this.handleLoginError(error);
          this.loginForm.enable();
        });
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.errorMessage = 'Please fill in all required fields correctly';
      this.cdr.detectChanges();
    }
  }

  private handleLoginSuccess(): void {
    this.isLoading = false;
    this.successMessage = 'Login successful!';
    this.cdr.detectChanges();
  }

  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.errorMessage = this.getErrorMessage(error);
    this.cdr.detectChanges();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          return 'Invalid email address';
        case 'auth/user-disabled':
          return 'This account has been disabled';
        case 'auth/user-not-found':
          return 'No account found with this email';
        case 'auth/wrong-password':
          return 'Incorrect password';
        case 'auth/too-many-requests':
          return 'Too many failed login attempts. Please try again later';
        default:
          return 'An error occurred during login';
      }
    }
    return error.message || 'An error occurred during login';
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  testBackend() {
    this.isLoading = true;
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

  async signInWithGoogle() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.clearMessages();
    
    // Disable form controls when loading
    this.loginForm.disable();
    
    try {
      await this.authService.signInWithGoogle();
      this.handleLoginSuccess();
    } catch (error: any) {
      this.handleLoginError(error);
      this.loginForm.enable();
    } finally {
      this.isLoading = false;
    }
  }
} 