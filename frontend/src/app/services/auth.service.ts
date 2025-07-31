import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserProfileService } from './user-profile.service';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private authReadySubject = new BehaviorSubject<boolean>(false);
  
  user$ = this.userSubject.asObservable();
  authReady$ = this.authReadySubject.asObservable();

  constructor(
    private auth: Auth, 
    private router: Router,
    private http: HttpClient,
    private userProfileService: UserProfileService
  ) {
    // Initialize Firebase Auth persistence
    setPersistence(this.auth, browserLocalPersistence).catch((error) => {
      console.error('Auth persistence error:', error);
    });

    // Listen to auth state changes
    onAuthStateChanged(this.auth, async (user) => {
      // console.log('Auth state changed:', user);
      this.userSubject.next(user);
      this.authReadySubject.next(true);

      // Sync with Supabase when user is authenticated
      if (user) {
        try {
          // console.log('Syncing user with Supabase:', user.uid);
          const response = await this.http.post(`https://gym-backend-simple-production.up.railway.app/api/users/sync`, {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName,
            avatarUrl: user.photoURL
          }).toPromise();
          // console.log('User synchronized with Supabase:', response);
          
          // Check if user has completed their profile
          this.checkUserProfile(user.uid);
        } catch (error) {
          console.error('Failed to sync user with Supabase:', error);
        }
      }
    });
  }

  /**
   * Checks if the user has completed their profile and redirects to onboarding if not
   * @param firebaseUid The Firebase UID of the user
   */
  private checkUserProfile(firebaseUid: string): void {
    // Set loading state
    this.authReadySubject.next(false);
    
    this.userProfileService.getPersonalProfile(firebaseUid)
      .pipe(
        map(profile => {
          // If we get a profile, the user has completed onboarding
          // console.log('User has completed profile:', profile);
          return true;
        }),
        catchError(error => {
          // If there's an error (e.g., 404 Not Found), the user hasn't completed onboarding
          // console.log('User has not completed profile:', error);
          return of(false);
        })
      )
      .subscribe(hasProfile => {
        // Set auth ready state
        this.authReadySubject.next(true);
        
        if (!hasProfile) {
          // Redirect to onboarding page if user hasn't completed profile
          // console.log('Redirecting to onboarding page');
          this.router.navigate(['/app-onboarding']);
        } else {
          // Redirect to dashboard if profile is complete
          // console.log('User has completed profile, proceeding to dashboard');
          this.router.navigate(['/dashboard']);
        }
      });
  }

  private setToken(token: string): void {
    // Store token in localStorage for persistence across page refreshes
    localStorage.setItem('token', token);
  }

  private setUserData(userData: { email: string | null; uid: string }): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private setupTokenRefresh(user: User): void {
    // Refresh token 5 minutes before expiration
    user.getIdTokenResult().then((result) => {
      const expirationTime = new Date(result.expirationTime).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiration = expirationTime - currentTime;
      const refreshTime = Math.max(0, timeUntilExpiration - 5 * 60 * 1000); // 5 minutes before expiration

      setTimeout(async () => {
        const newToken = await user.getIdToken(true);
        this.setToken(newToken);
        this.setupTokenRefresh(user);
      }, refreshTime);
    });
  }

  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      // The onAuthStateChanged listener will handle the Supabase sync
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      // The onAuthStateChanged listener will handle the Supabase sync
      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      // The onAuthStateChanged listener will handle the Supabase sync
      return userCredential;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      this.clearAuthData();
     // this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // Force refresh
      this.setToken(token);
      return token;
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  isGoogleAuthEnabled(): boolean {
    return true; // You might want to implement a more sophisticated check
  }
} 