import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { WeightProgress } from '../../services/user-profile.service';

@Component({
  selector: 'app-add-weight-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="weight-form-container" [class.expanded]="isExpanded">
      <div class="form-header" (click)="toggleForm()">
        <h3>Add Weight Measurement</h3>
        <button class="toggle-button">
          <mat-icon>{{ isExpanded ? 'expand_less' : 'expand_more' }}</mat-icon>
        </button>
      </div>
      
      <div class="form-content" [class.visible]="isExpanded">
        <form [formGroup]="weightForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="weight-field">
              <mat-label>Weight (kg)</mat-label>
              <input matInput type="number" formControlName="weight" placeholder="Enter weight in kg">
              <mat-error *ngIf="weightForm.get('weight')?.hasError('required')">
                Weight is required
              </mat-error>
              <mat-error *ngIf="weightForm.get('weight')?.hasError('min')">
                Weight must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Measurement Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="measurementDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="weightForm.get('measurementDate')?.hasError('required')">
                Measurement date is required
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes (optional)</mat-label>
            <textarea matInput formControlName="notes" placeholder="Add any notes samir "></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" class="cancel-button" (click)="resetForm()">Reset</button>
            <button mat-raised-button type="submit" class="submit-button" [disabled]="weightForm.invalid">
              Add Measurement
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .weight-form-container {
      background: #1a1a2e;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 20px;
      border: 1px solid rgba(255, 107, 107, 0.2);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: rgba(255, 107, 107, 0.1);
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(255, 107, 107, 0.15);
      }

      h3 {
        margin: 0;
        color: #ff6b6b;
        font-size: 1.2rem;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .toggle-button {
        color: rgba(255, 107, 107, 0.7);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &:hover {
          color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
        }
      }
    }

    .form-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
      padding: 0 20px;
      opacity: 0;

      &.visible {
        max-height: 500px;
        padding: 20px;
        opacity: 1;
      }
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 0;
      }
    }

    .weight-field {
      flex: 1;
    }

    .date-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }

    .cancel-button {
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 107, 107, 0.3);
      
      &:hover {
        background: rgba(255, 107, 107, 0.1);
        color: #ff6b6b;
      }
    }

    .submit-button {
      background: #ff6b6b;
      color: white;
      border: none;
      
      &:hover {
        background: #ff5252;
      }
      
      &:disabled {
        background: rgba(255, 107, 107, 0.3);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ::ng-deep {
      .mat-mdc-form-field {
        --mdc-filled-text-field-container-color: rgba(255, 107, 107, 0.05);
        --mdc-filled-text-field-focus-active-indicator-color: #ff6b6b;
        --mdc-filled-text-field-hover-state-layer-color: rgba(255, 107, 107, 0.1);
        --mdc-filled-text-field-focus-state-layer-color: rgba(255, 107, 107, 0.1);
        --mdc-filled-text-field-label-text-color: rgba(255, 107, 107, 0.7);
        --mdc-filled-text-field-input-text-color: rgba(255, 255, 255, 0.9);
        --mdc-filled-text-field-caret-color: #ff6b6b;
      }

      .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .mat-mdc-form-field-error {
        color: #ff6b6b;
      }

      .mat-mdc-form-field-outline {
        color: rgba(255, 107, 107, 0.2) !important;
      }

      .mat-mdc-form-field:hover .mat-mdc-form-field-outline {
        color: rgba(255, 107, 107, 0.3) !important;
      }

      .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline {
        color: rgba(255, 107, 107, 0.5) !important;
      }

      .mat-mdc-text-field-wrapper {
        background-color: rgba(255, 107, 107, 0.05) !important;
      }

      .mat-mdc-form-field-focus-overlay {
        background-color: rgba(255, 107, 107, 0.05) !important;
      }

      .mat-mdc-select-value-text {
        color: rgba(255, 255, 255, 0.9) !important;
      }

      .mat-mdc-select-arrow {
        color: rgba(255, 107, 107, 0.7) !important;
      }

      .mat-mdc-select-panel {
        background: #1a1a2e !important;
        border: 1px solid rgba(255, 107, 107, 0.2) !important;
      }

      .mat-mdc-option {
        color: rgba(255, 255, 255, 0.9) !important;
        
        &:hover:not(.mat-mdc-option-disabled) {
          background: rgba(255, 107, 107, 0.1) !important;
        }
        
        &.mat-mdc-selected {
          background: rgba(255, 107, 107, 0.2) !important;
          color: #ff6b6b !important;
        }
      }

      .mat-calendar {
        background: #1a1a2e !important;
        color: rgba(255, 255, 255, 0.9) !important;
      }

      .mat-calendar-header {
        background: rgba(255, 107, 107, 0.1) !important;
      }

      .mat-calendar-body-cell {
        color: rgba(255, 255, 255, 0.9) !important;
        
        &:hover {
          background: rgba(255, 107, 107, 0.1) !important;
        }
        
        &.mat-calendar-body-active {
          background: #ff6b6b !important;
          color: white !important;
        }
      }

      .mat-calendar-body-today {
        border-color: #ff6b6b !important;
      }
    }
  `]
})
export class AddWeightFormComponent {
  @Input() isExpanded = false;
  @Output() submitMeasurement = new EventEmitter<Partial<WeightProgress>>();

  weightForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.weightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(0.1)]],
      measurementDate: [new Date(), Validators.required],
      notes: ['']
    });
  }

  toggleForm(): void {
    this.isExpanded = !this.isExpanded;
  }

  resetForm(): void {
    this.weightForm.reset({
      weight: '',
      measurementDate: new Date(),
      notes: ''
    });
  }

  onSubmit(): void {
    if (this.weightForm.valid) {
      const formValue = this.weightForm.value;
      
      const weightMeasurement: Partial<WeightProgress> = {
        weightKg: formValue.weight,
        measurementDate: formValue.measurementDate.toISOString(),
        notes: formValue.notes || null,
        pictureUrl: null
      };
      
      this.submitMeasurement.emit(weightMeasurement);
      this.resetForm();
      this.isExpanded = false;
    }
  }
} 