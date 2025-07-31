import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';
import { map, take, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private dialogService: DialogService
  ) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.authService.authReady$,
      this.authService.user$
    ]).pipe(
      // Wait until auth is ready
      filter(([ready]) => ready),
      take(1),
      map(([_, user]) => {
        if (user) {
          return true;
        }
        
        // Show login dialog before redirecting
        this.dialogService.openDialog(
          'Authentication Required',
          'You need to sign in to access this page.'
        );
        
        // The dialog will handle navigation to login page when the user clicks the login button
        return false;
      })
    );
  }
} 