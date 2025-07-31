import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  notes: string;
}

export interface WorkoutDay {
  day: string;
  workoutType: string;
  durationMinutes: number;
  exercises: Exercise[];
  caloriesBurnt: number;
  notes: string;
}

export interface WorkoutPlan {
  weeklySchedule: WorkoutDay[];
  progressionPlan: string;
  safetyPrecautions: string;
}

export interface WorkoutPlanResponse {
  profileDescription: string;
  workoutPlan: WorkoutPlan;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanService {
  private apiUrl = `https://gym-backend-simple-production.up.railway.app/api/workout-plans`;

  constructor(private http: HttpClient) {}

  /**
   * Generates a personalized workout plan for a user
   * @param firebaseUid The Firebase UID of the user
   * @returns An Observable of the generated workout plan response
   */
  generateWorkoutPlan(firebaseUid: string): Observable<WorkoutPlanResponse> {
    return this.http.post<WorkoutPlanResponse>(`${this.apiUrl}/generate/${firebaseUid}`, {});
  }

  /**
   * Gets the latest workout plan for a user
   * @param firebaseUid The Firebase UID of the user
   * @returns An Observable of the latest workout plan
   */
  getLatestWorkoutPlan(firebaseUid: string): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.apiUrl}/${firebaseUid}`);
  }
} 