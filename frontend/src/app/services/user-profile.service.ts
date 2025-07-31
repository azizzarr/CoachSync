import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface WeightProgress {
  id: string;
  weightKg: number;
  measurementDate: string;
  pictureUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  workouts: any[];
  weightProgress: WeightProgress[];
  isActive?: boolean;
  trainerName?: string | null;
}

export interface UserProfileDTO {
  dateOfBirth: string;
  gender: string;
  height: number;
  currentWeight: number;
  targetWeight: number;
  activityLevel: string;
  fitnessGoals: string;
  workoutLocations: string;
  workoutTimes: string;
  availableEquipment: string;
  healthConditions: string;
  otherHealthCondition: string | null;
}

export interface Workout {
  id: string;
  workoutDate: string;
  workoutType: string;
  durationMinutes: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
  }>;
  notes: string;
  caloriesBurnt: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  //private apiUrl = 'https://gymapp-backend-production-85ac.up.railway.app/api/users';
  private apiUrl = 'https://gym-backend-simple-production.up.railway.app/api/users';
  constructor(private http: HttpClient) {}    

  getUserProfile(firebaseUid: string): Observable<UserProfile> {
    // Ensure we're using an absolute URL
    const url = `${this.apiUrl}/profile/${firebaseUid}`;
   // console.log('Requesting profile from:', url);
    
    return this.http.get<UserProfile>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while fetching the user profile';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        
       console.error('UserProfileService Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  createProfile(firebaseUid: string, profileData: UserProfileDTO): Observable<UserProfile> {
    const url = `https://gym-backend-simple-production.up.railway.app/api/api/profiles/${firebaseUid}`;
   // console.log('Creating profile at:', url);
    
    return this.http.post<UserProfile>(url, profileData).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while creating the user profile';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        
        console.error('UserProfileService Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getPersonalProfile(firebaseUid: string): Observable<UserProfileDTO> {
    // Use the correct backend endpoint for UserProfileDTO
    const url = `https://gym-backend-simple-production.up.railway.app/api/api/profiles/${firebaseUid}`;
    return this.http.get<UserProfileDTO>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while fetching the personal profile';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error('UserProfileService Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUserWorkouts(firebaseUid: string): Observable<Workout[]> {
    const url = `https://gym-backend-simple-production.up.railway.app/api/workouts/${firebaseUid}`;
    return this.http.get<Workout[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while fetching workouts';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error('UserProfileService Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  addWeightMeasurement(firebaseUid: string, weightData: Partial<WeightProgress>): Observable<WeightProgress> {
    const url = `https://gym-backend-simple-production.up.railway.app/api/api/weight-progress/${firebaseUid}`;
    return this.http.post<WeightProgress>(url, weightData).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while adding weight measurement';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error('UserProfileService Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
} 