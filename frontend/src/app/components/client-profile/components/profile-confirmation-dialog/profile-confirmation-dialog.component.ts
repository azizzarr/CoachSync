import { Component, Inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileDTO } from '../../../../services/user-profile.service';
import { WorkoutPlanService } from '../../../../services/workout-plan.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="header-icon">fitness_center</mat-icon>
        <h2 mat-dialog-title>Confirm Profile Information</h2>
      </div>
      
      <mat-dialog-content class="scrollable-content">
        <div *ngIf="!isLoading && !isSuccess" class="profile-summary">
          <div class="profile-section">
            <div class="section-icon">
              <mat-icon>person</mat-icon>
            </div>
            <div class="section-content">
              <p class="profile-paragraph" [innerHTML]="personalInfoText()"></p>
            </div>
          </div>
          
          <div class="profile-section">
            <div class="section-icon">
              <mat-icon>directions_run</mat-icon>
            </div>
            <div class="section-content">
              <p class="profile-paragraph" [innerHTML]="activityInfoText()"></p>
            </div>
          </div>
          
          <div class="profile-section">
            <div class="section-icon">
              <mat-icon>place</mat-icon>
            </div>
            <div class="section-content">
              <p class="profile-paragraph" [innerHTML]="locationInfoText()"></p>
            </div>
          </div>
          
          <div class="profile-section" *ngIf="data.healthConditions || data.otherHealthCondition">
            <div class="section-icon">
              <mat-icon>favorite</mat-icon>
            </div>
            <div class="section-content">
              <p class="profile-paragraph" [innerHTML]="healthInfoText()"></p>
            </div>
          </div>
        </div>
        
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="60" color="accent"></mat-spinner>
          <h3 class="loading-title">Generating Your Workout Plan</h3>
          <p class="loading-text">Our AI is creating a personalized workout plan based on your profile...</p>
        </div>
        
        <div *ngIf="isSuccess" class="success-container">
          <div class="success-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          <h3 class="success-title">Workout Plan Generated Successfully!</h3>
          <p class="success-text">Your personalized workout plan has been created and is ready to view.</p>
        </div>
        
        <div *ngIf="!isLoading && !isSuccess" class="confirmation-section">
          <mat-icon class="confirmation-icon">psychology</mat-icon>
          <p class="confirmation-text">Would you like to generate a personalized workout plan based on these details?</p>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end" class="sticky-actions">
        <button *ngIf="!isLoading && !isSuccess" mat-button (click)="onDecline()">
          <mat-icon>close</mat-icon>
          <span>Decline</span>
        </button>
        <button *ngIf="!isLoading && !isSuccess" mat-raised-button color="primary" (click)="onAccept()">
          <mat-icon>check</mat-icon>
          <span>Generate Workout Plan</span>
        </button>
        <button *ngIf="isSuccess" mat-button (click)="onClose()">
          <mat-icon>close</mat-icon>
          <span>Close</span>
        </button>
        <button *ngIf="isSuccess" mat-raised-button color="primary" (click)="onVisitWorkoutPlan()">
          <mat-icon>calendar_today</mat-icon>
          <span>Visit Workout Plan</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      max-width: 600px;
      width: 100%;
      min-width: 280px;
      font-family: 'Roboto', sans-serif;
      background: linear-gradient(135deg, #232526 0%, #414345 100%);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(243, 97, 0, 0.18), 0 2px 8px rgba(0,0,0,0.12);
      border: none;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    
    @media (max-width: 480px) {
      .dialog-container {
        width: 100vw;
        max-width: 100vw;
        margin: 0;
        border-radius: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
    }
    
    .dialog-header {
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      color: white;
      padding: 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
    }
    
    @media (max-width: 480px) {
      .dialog-header {
        padding: 16px 12px;
        width: 100%;
      }
    }
    
    .dialog-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
      pointer-events: none;
    }
    
    .header-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
    
    @media (max-width: 480px) {
      .header-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
    
    h2[mat-dialog-title] {
      color: white;
      font-weight: 600;
      margin: 0;
      font-size: 22px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 480px) {
      h2[mat-dialog-title] {
        font-size: 18px;
      }
    }
    
    mat-dialog-content.scrollable-content {
      flex: 1 1 auto;
      overflow-y: auto;
      max-height: 60vh;
      min-height: 0;
      margin-bottom: 90px; /* Height of the fixed actions bar */
    }
    
    @media (max-width: 480px) {
      mat-dialog-content.scrollable-content {
        max-height: calc(100vh - 120px);
        min-height: 0;
        margin-bottom: 90px;
      }
    }
    
    .profile-summary {
      margin: 0 0 16px 0;
      background: #242424;
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
      overflow: hidden;
    }
    
    .profile-section {
      display: flex;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background-color 0.3s ease;
    }
    
    @media (max-width: 480px) {
      .profile-section {
        padding: 12px;
        flex-direction: column;
        gap: 12px;
      }
    }
    
    .profile-section:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    
    .profile-section:last-child {
      border-bottom: none;
    }
    
    .section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      border-radius: 10px;
      margin-right: 16px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
    }
    
    @media (max-width: 480px) {
      .section-icon {
        width: 36px;
        height: 36px;
        margin-right: 0;
      }
    }
    
    .section-icon mat-icon {
      color: white;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    @media (max-width: 480px) {
      .section-icon mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    
    .section-content {
      flex: 1;
    }
    
    .profile-paragraph {
      margin: 0;
      line-height: 1.6;
      color: #e0e0e0;
      font-size: 14px;
    }
    
    @media (max-width: 480px) {
      .profile-paragraph {
        font-size: 13px;
        line-height: 1.5;
      }
    }
    
    .highlight {
      background: linear-gradient(120deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 140, 66, 0.2) 100%);
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      color: #ff8c42;
      display: inline-block;
      position: relative;
      border: 1px solid rgba(255, 107, 53, 0.3);
      box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
      margin: 0 2px;
      transition: all 0.3s ease;
    }
    
    .highlight:hover {
      background: linear-gradient(120deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 140, 66, 0.3) 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
    }
    
    .highlight.personal {
      background: linear-gradient(120deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 140, 66, 0.3) 100%);
      color: #ffffff;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 107, 53, 0.5);
      box-shadow: 0 3px 10px rgba(255, 107, 53, 0.25);
      text-transform: capitalize;
      letter-spacing: 0.5px;
    }
    
    .highlight.personal:hover {
      background: linear-gradient(120deg, rgba(255, 107, 53, 0.4) 0%, rgba(255, 140, 66, 0.4) 100%);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 107, 53, 0.35);
    }
    
    .highlight.activity {
      background: linear-gradient(120deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.2) 100%);
      color: #8bc34a;
      border: 1px solid rgba(76, 175, 80, 0.3);
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
    }
    
    .highlight.activity:hover {
      background: linear-gradient(120deg, rgba(76, 175, 80, 0.3) 0%, rgba(139, 195, 74, 0.3) 100%);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.25);
    }
    
    .highlight.location {
      background: linear-gradient(120deg, rgba(33, 150, 243, 0.2) 0%, rgba(3, 169, 244, 0.2) 100%);
      color: #03a9f4;
      border: 1px solid rgba(33, 150, 243, 0.3);
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
    }
    
    .highlight.location:hover {
      background: linear-gradient(120deg, rgba(33, 150, 243, 0.3) 0%, rgba(3, 169, 244, 0.3) 100%);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.25);
    }
    
    .highlight.health {
      background: linear-gradient(120deg, rgba(233, 30, 99, 0.2) 0%, rgba(216, 27, 96, 0.2) 100%);
      color: #e91e63;
      border: 1px solid rgba(233, 30, 99, 0.3);
      box-shadow: 0 2px 8px rgba(233, 30, 99, 0.15);
    }
    
    .highlight.health:hover {
      background: linear-gradient(120deg, rgba(233, 30, 99, 0.3) 0%, rgba(216, 27, 96, 0.3) 100%);
      box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
    }
    
    .confirmation-section {
      margin-top: 16px;
      padding: 20px 16px;
      background: #242424;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    @media (max-width: 480px) {
      .confirmation-section {
        padding: 16px 12px;
        gap: 12px;
      }
    }
    
    .confirmation-icon {
      color: #ff6b35;
      font-size: 24px;
      width: 24px;
      height: 24px;
      filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.2));
    }
    
    @media (max-width: 480px) {
      .confirmation-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
    
    .confirmation-text {
      font-weight: 500;
      color: #e0e0e0;
      font-size: 15px;
      margin: 0;
      flex: 1;
    }
    
    @media (max-width: 480px) {
      .confirmation-text {
        font-size: 14px;
      }
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      background: #242424;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 16px;
    }
    
    @media (max-width: 480px) {
      .loading-container {
        padding: 24px 12px;
      }
    }
    
    .loading-title {
      color: #e0e0e0;
      font-size: 18px;
      font-weight: 500;
      margin: 16px 0 8px;
    }
    
    @media (max-width: 480px) {
      .loading-title {
        font-size: 16px;
        margin: 12px 0 6px;
      }
    }
    
    .loading-text {
      color: #b0b0b0;
      font-size: 14px;
      text-align: center;
      margin: 0;
    }
    
    @media (max-width: 480px) {
      .loading-text {
        font-size: 13px;
      }
    }
    
    .success-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      background: #242424;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 16px;
    }
    
    @media (max-width: 480px) {
      .success-container {
        padding: 24px 12px;
      }
    }
    
    .success-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
      border-radius: 50%;
      margin-bottom: 16px;
      box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
    }
    
    @media (max-width: 480px) {
      .success-icon {
        width: 56px;
        height: 56px;
        margin-bottom: 12px;
      }
    }
    
    .success-icon mat-icon {
      color: white;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    @media (max-width: 480px) {
      .success-icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }
    
    .success-title {
      color: #e0e0e0;
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 8px;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      .success-title {
        font-size: 18px;
        margin: 0 0 6px;
      }
    }
    
    .success-text {
      color: #b0b0b0;
      font-size: 15px;
      text-align: center;
      margin: 0;
    }
    
    @media (max-width: 480px) {
      .success-text {
        font-size: 14px;
      }
    }
    
    mat-dialog-actions.sticky-actions {
      /* Desktop/laptop: compact spacing */
      width: auto;
      z-index: 9999;
      background: transparent;
      border-top: none;
      padding: 12px 16px 16px 16px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      box-shadow: none;
    }
    @media (max-width: 480px) {
      mat-dialog-actions.sticky-actions {
        position: fixed;
        left: 0;
        bottom: 0;
        padding: 12px;
        padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
        gap: 8px;
        flex-direction: row;
        width: 100vw;
        justify-content: space-between;
        background: #242424;
        box-shadow: 0 -4px 16px rgba(0,0,0,0.25);
      }
      mat-dialog-actions.sticky-actions button {
        flex: 1;
        margin: 0;
        height: 44px;
        font-size: 15px;
        border-radius: 24px;
      }
    }
    mat-dialog-actions.sticky-actions button[mat-raised-button] {
      background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%);
      color: #fff;
      font-weight: 700;
      border-radius: 24px;
      box-shadow: 0 2px 8px rgba(243, 97, 0, 0.18);
      padding: 0.75rem 2.5rem;
      font-size: 1.08rem;
      letter-spacing: 0.5px;
      transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
      border: none;
      outline: none;
    }
    mat-dialog-actions.sticky-actions button[mat-raised-button]:hover {
      background: linear-gradient(90deg, #ff7a3f 0%, #ff9a52 100%);
      box-shadow: 0 4px 16px rgba(243, 97, 0, 0.25);
      transform: translateY(-2px) scale(1.03);
    }
    mat-dialog-actions.sticky-actions button[mat-raised-button]:active {
      background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%);
      box-shadow: 0 2px 8px rgba(243, 97, 0, 0.18);
      transform: scale(0.98);
    }
    mat-dialog-actions.sticky-actions button[mat-button] {
      background: rgba(255, 255, 255, 0.08);
      color: #ff8c42;
      border: 2px solid #ff8c42;
      border-radius: 24px;
      font-weight: 600;
      padding: 0.75rem 2.2rem;
      font-size: 1.08rem;
      letter-spacing: 0.5px;
      transition: background 0.2s, color 0.2s, border 0.2s, transform 0.1s;
      outline: none;
    }
    mat-dialog-actions.sticky-actions button[mat-button]:hover {
      background: #ff8c42;
      color: #fff;
      border: 2px solid #ff8c42;
      transform: translateY(-2px) scale(1.03);
    }
    mat-dialog-actions.sticky-actions button[mat-button]:active {
      background: #ff6b35;
      color: #fff;
      border: 2px solid #ff6b35;
      transform: scale(0.98);
    }
    /* Add fadeIn animation */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    ::ng-deep .mat-mdc-dialog-container {
      --mdc-dialog-container-color: transparent;
      --mdc-dialog-container-shape: 16px;
      padding: 0;
    }
    
    ::ng-deep .mat-mdc-dialog-surface {
      background: transparent;
      box-shadow: none;
      width: 100%;
    }
    
    @media (max-width: 480px) {
      ::ng-deep .mat-mdc-dialog-container {
        --mdc-dialog-container-shape: 0;
        padding: 0;
        max-width: 100vw;
        width: 100vw;
      }
      
      ::ng-deep .mat-mdc-dialog-surface {
        width: 100vw;
        max-width: 100vw;
      }
      
      ::ng-deep .cdk-overlay-pane {
        max-width: 100vw !important;
        width: 100vw !important;
      }
    }
    
    .info-section {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }
    }
    
    .info-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      mat-icon {
        color: #ff6b35;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        background: rgba(255, 107, 53, 0.1);
        padding: 0.5rem;
        border-radius: 8px;
      }
      
      span {
        font-size: 1.1rem;
        font-weight: 600;
        color: #ffffff;
        letter-spacing: 0.5px;
      }
    }
    
    .info-content {
      p {
        margin: 0 0 0.75rem 0;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
        line-height: 1.6;
      }
    }
    
    .stats-grid,
    .activity-grid,
    .preferences-grid,
    .health-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 0.75rem;
    }
    
    .stat-item,
    .activity-item,
    .preference-item,
    .health-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
      }
    }
    
    .stat-label,
    .activity-label,
    .preference-label,
    .health-label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .highlight {
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
      position: relative;
      transition: all 0.3s ease;
      text-transform: capitalize;
      letter-spacing: 0.5px;
      
      &.personal {
        background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 140, 66, 0.2) 100%);
        color: #ff8c42;
        border: 1px solid rgba(255, 107, 53, 0.3);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
        
        &:hover {
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 140, 66, 0.3) 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 53, 0.25);
        }
      }
      
      &.activity {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.2) 100%);
        color: #8bc34a;
        border: 1px solid rgba(76, 175, 80, 0.3);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
        
        &:hover {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(139, 195, 74, 0.3) 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(76, 175, 80, 0.25);
        }
      }
      
      &.location {
        background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(3, 169, 244, 0.2) 100%);
        color: #03a9f4;
        border: 1px solid rgba(33, 150, 243, 0.3);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
        
        &:hover {
          background: linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(3, 169, 244, 0.3) 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(33, 150, 243, 0.25);
        }
      }
      
      &.health {
        background: linear-gradient(135deg, rgba(233, 30, 99, 0.2) 0%, rgba(216, 27, 96, 0.2) 100%);
        color: #e91e63;
        border: 1px solid rgba(233, 30, 99, 0.3);
        box-shadow: 0 4px 12px rgba(233, 30, 99, 0.15);
        
        &:hover {
          background: linear-gradient(135deg, rgba(233, 30, 99, 0.3) 0%, rgba(216, 27, 96, 0.3) 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(233, 30, 99, 0.25);
        }
      }
    }
    
    @media (max-width: 768px) {
      .info-section {
        padding: 1rem;
      }
      
      .info-header {
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        
        mat-icon {
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
          padding: 0.375rem;
        }
        
        span {
          font-size: 1rem;
        }
      }
      
      .stats-grid,
      .activity-grid,
      .preferences-grid,
      .health-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .stat-item,
      .activity-item,
      .preference-item,
      .health-item {
        padding: 0.625rem;
      }
      
      .highlight {
        padding: 0.375rem 0.625rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ProfileConfirmationDialogComponent implements OnInit {
  isLoading = false;
  isSuccess = false;
  
  // Typing effect signals
  private personalInfoIndex = signal(0);
  private activityInfoIndex = signal(0);
  private locationInfoIndex = signal(0);
  private healthInfoIndex = signal(0);
  
  // Full text content
  private personalInfoFull = '';
  private activityInfoFull = '';
  private locationInfoFull = '';
  private healthInfoFull = '';
  
  // Computed text with typing effect
  personalInfoText = computed(() => {
    return this.personalInfoFull.substring(0, this.personalInfoIndex());
  });
  
  activityInfoText = computed(() => {
    return this.activityInfoFull.substring(0, this.activityInfoIndex());
  });
  
  locationInfoText = computed(() => {
    return this.locationInfoFull.substring(0, this.locationInfoIndex());
  });
  
  healthInfoText = computed(() => {
    return this.healthInfoFull.substring(0, this.healthInfoIndex());
  });

  constructor(
    public dialogRef: MatDialogRef<ProfileConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProfileDTO,
    private snackBar: MatSnackBar,
    private workoutPlanService: WorkoutPlanService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Prepare the full text content
    this.prepareTextContent();
    
    // Start the typing effect
    this.startTypingEffect();
  }
  
  private prepareTextContent(): void {
    // Personal info
    this.personalInfoFull = `Based on your profile, you are a <span class="highlight personal">${this.data.gender.toLowerCase()}</span> who is <span class="highlight personal">${this.calculateAge(this.data.dateOfBirth)} years old</span>, standing <span class="highlight personal">${this.data.height} cm</span> tall. Your current weight is <span class="highlight personal">${this.data.currentWeight} kg</span>, with a target weight of <span class="highlight personal">${this.data.targetWeight} kg</span>.`;
    
    // Activity info
    this.activityInfoFull = `You have indicated a <span class="highlight activity">${this.data.activityLevel.toLowerCase()}</span> activity level and your primary fitness goals are <span class="highlight activity">${this.data.fitnessGoals.toLowerCase()}</span>.`;
    
    // Location info
    this.locationInfoFull = `You prefer to work out at <span class="highlight location">${this.data.workoutLocations.toLowerCase()}</span> during <span class="highlight location">${this.data.workoutTimes.toLowerCase()}</span>. Your available equipment includes <span class="highlight location">${this.data.availableEquipment.toLowerCase()}</span>.`;
    
    // Health info
    let healthText = 'Regarding your health considerations: ';
    if (this.data.healthConditions) {
      healthText += `<span class="highlight health">${this.data.healthConditions.toLowerCase()}</span>`;
    }
    if (this.data.healthConditions && this.data.otherHealthCondition) {
      healthText += ', and ';
    }
    if (this.data.otherHealthCondition) {
      healthText += `<span class="highlight health">${this.data.otherHealthCondition.toLowerCase()}</span>`;
    }
    healthText += '.';
    this.healthInfoFull = healthText;
  }
  
  private startTypingEffect(): void {
    // Start typing personal info immediately
    this.typeText(this.personalInfoIndex, this.personalInfoFull.length, 30);
    
    // Start typing activity info after 1.5 seconds
    setTimeout(() => {
      this.typeText(this.activityInfoIndex, this.activityInfoFull.length, 30);
    }, 1500);
    
    // Start typing location info after 3 seconds
    setTimeout(() => {
      this.typeText(this.locationInfoIndex, this.locationInfoFull.length, 30);
    }, 3000);
    
    // Start typing health info after 4.5 seconds
    setTimeout(() => {
      this.typeText(this.healthInfoIndex, this.healthInfoFull.length, 30);
    }, 4500);
  }
  
  private typeText(indexSignal: any, maxLength: number, speed: number): void {
    let currentIndex = 0;
    
    const type = () => {
      if (currentIndex < maxLength) {
        currentIndex++;
        indexSignal.set(currentIndex);
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  onAccept(): void {
    this.isLoading = true;
    
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.isLoading = false;
      this.snackBar.open('User not authenticated. Please log in again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    // Call the workout plan service to generate the plan
    this.workoutPlanService.generateWorkoutPlan(user.uid).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        
        // Show success snackbar
        this.snackBar.open('Workout plan generated successfully!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error generating workout plan:', error);
        
        // Show error snackbar
        this.snackBar.open('Failed to generate workout plan. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onDecline(): void {
    // Pass false to indicate no generation
    this.dialogRef.close({ success: false });
  }
  
  onClose(): void {
    // Pass true to indicate successful generation
    this.dialogRef.close({ success: true });
  }
  
  onVisitWorkoutPlan(): void {
    // Close the dialog and navigate to the workout calendar
    this.dialogRef.close({ success: true, navigate: true });
    this.router.navigate(['/workout-calendar']);
  }
} 