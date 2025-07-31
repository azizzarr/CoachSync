import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WeightProgress } from '../../services/user-profile.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-weight-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="add-weight-container">
      <button mat-raised-button class="add-weight-button" (click)="toggleExpansion()">
        <mat-icon>fitness_center</mat-icon>
        <span>Add Weight Measurement</span>
      </button>
      
      <div class="form-container" [class.expanded]="isOpen">
        <div class="form-header">
          <div class="header-content">
            <mat-icon class="header-icon">monitor_weight</mat-icon>
            <h3>New Weight Measurement</h3>
          </div>
          <button class="close-button" (click)="close()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <form [formGroup]="weightForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="input-card">
              <div class="input-header">
                <mat-icon>monitor_weight</mat-icon>
                <span>Weight</span>
              </div>
              
              <div class="weight-input-container">
                <div class="weight-display">
                  <span class="weight-value">{{ currentWeight | number:'1.1-1' }}</span>
                  <span class="weight-unit">kg</span>
                </div>
                
                <mat-slider
                  class="weight-slider"
                  [min]="30"
                  [max]="200"
                  [step]="0.1"
                  [discrete]="true"
                  [showTickMarks]="true"
                  [formControl]="weightControl">
                  <input matSliderThumb [formControl]="weightControl">
                </mat-slider>
                
                <div class="weight-range">
                  <span>30 kg</span>
                  <span>200 kg</span>
                </div>
              </div>
              
              <mat-error *ngIf="weightForm.get('weight')?.hasError('required') && weightForm.get('weight')?.touched">
                Weight is required
              </mat-error>
            </div>

            <div class="input-card">
              <div class="input-header">
                <mat-icon>calendar_today</mat-icon>
                <span>Measurement Date</span>
              </div>
              
              <div class="date-input-container">
                <mat-form-field appearance="outline" class="full-width">
                  <input matInput [matDatepicker]="picker" formControlName="measurementDate">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              </div>
              
              <mat-error *ngIf="weightForm.get('measurementDate')?.hasError('required') && weightForm.get('measurementDate')?.touched">
                Measurement date is required
              </mat-error>
            </div>

            <div class="input-card notes-card">
              <div class="input-header">
                <mat-icon>note</mat-icon>
                <span>Notes (optional)</span>
              </div>
              
              <div class="notes-input-container">
                <mat-form-field appearance="outline" class="full-width">
                  <textarea matInput formControlName="notes" placeholder="Add any notes samir" rows="2"></textarea>
                </mat-form-field>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button mat-button type="button" class="cancel-button" (click)="close()">
              <mat-icon>close</mat-icon>
              <span>Cancel</span>
            </button>
            <button mat-raised-button type="submit" class="submit-button" [disabled]="weightForm.invalid">
              <mat-icon>check</mat-icon>
              <span>Add Measurement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-weight-container {
      margin: 16px 0;
      position: relative;
      width: 100%;
    }

    .add-weight-button {
      background: linear-gradient(135deg, #e94560 0%, #ff6b8b 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
      width: 100%;
      justify-content: center;
      
      &:hover {
        background: linear-gradient(135deg, #ff5252 0%, #ff7a7a 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(233, 69, 96, 0.4);
      }
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .form-container {
      background:rgb(49, 47, 47);
      border-radius: 16px;
      margin-top: 20px;
      border: 1px solid rgba(107, 101, 106, 0.2);
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

      &.expanded {
        max-height: 700px;
        padding: 16px;
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid rgba(233, 69, 96, 0.1);

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          color: #e94560;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        h3 {
          margin: 0;
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
        }
      }

      .close-button {
        color: rgba(255, 255, 255, 0.7);
        background: transparent;
        border: none;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .form-grid {
      display: grid;
      gap: 12px;
      margin-bottom: 12px;
    }

    .input-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(233, 69, 96, 0.3);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .input-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        
        mat-icon {
          color: #e94560;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
        
        span {
          font-weight: 500;
          color: #ffffff;
          font-size: 1rem;
        }
      }
    }

    .weight-input-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
    }

    .weight-display {
      display: flex;
      align-items: baseline;
      gap: 4px;
      
      .weight-value {
        font-size: 1.8rem;
        font-weight: 600;
        color: #e94560;
      }
      
      .weight-unit {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
      }
    }

    .weight-slider {
      width: 100%;
      margin: 8px 0;
    }

    .weight-range {
      display: flex;
      justify-content: space-between;
      width: 100%;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
    }

    .date-input-container {
      padding: 2px 0;
    }

    .notes-card {
      grid-column: 1 / -1;
    }

    .notes-input-container {
      padding: 2px 0;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid rgba(233, 69, 96, 0.1);
    }

    .cancel-button {
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 12px;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.2);
      }

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .submit-button {
      background: linear-gradient(135deg, #e94560 0%, #ff6b8b 100%);
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, #ff5252 0%, #ff7a7a 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
      }
      
      &:disabled {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
        transform: none;
        box-shadow: none;
      }

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    ::ng-deep {
      .mat-mdc-form-field {
        --mdc-filled-text-field-container-color: rgba(255, 255, 255, 0.05);
        --mdc-filled-text-field-focus-active-indicator-color: #e94560;
        --mdc-filled-text-field-hover-state-layer-color: rgba(233, 69, 96, 0.05);
        --mdc-filled-text-field-focus-state-layer-color: rgba(233, 69, 96, 0.1);
        --mdc-filled-text-field-label-text-color: #ffffff;
        --mdc-filled-text-field-input-text-color: #ffffff;
        --mdc-filled-text-field-caret-color: #e94560;
        --mdc-filled-text-field-placeholder-text-color: rgba(255, 255, 255, 0.7);
      }

      .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .mat-mdc-form-field-error {
        color: #e94560;
        margin-top: 8px;
        font-size: 0.8rem;
      }

      .mat-mdc-form-field-outline {
        color: rgba(255, 255, 255, 0.2) !important;
      }

      .mat-mdc-form-field:hover .mat-mdc-form-field-outline {
        color: rgba(255, 255, 255, 0.3) !important;
      }

      .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline {
        color: #e94560 !important;
      }

      .mat-mdc-text-field-wrapper {
        background-color: rgba(255, 255, 255, 0.08) !important;
        border-radius: 8px !important;
      }

      .mat-mdc-form-field-focus-overlay {
        background-color: transparent !important;
      }

      .mat-mdc-select-value-text {
        color: #ffffff !important;
      }

      .mat-mdc-select-arrow {
        color: #ffffff !important;
      }

      .mat-mdc-select-panel {
        background: #2d2d2d !important;
        border: 1px solid rgba(233, 69, 96, 0.3) !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .mat-mdc-option {
        color: #ffffff !important;
        
        &:hover:not(.mat-mdc-option-disabled) {
          background: rgba(233, 69, 96, 0.15) !important;
        }
        
        &.mat-mdc-selected {
          background: rgba(233, 69, 96, 0.25) !important;
          color: #ffffff !important;
        }
      }

      .mat-calendar {
        background: #2d2d2d !important;
        color: #ffffff !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .mat-calendar-header {
        background: rgba(233, 69, 96, 0.15) !important;
        border-radius: 8px 8px 0 0 !important;
        padding: 12px !important;
        color: #ffffff !important;
      }

      .mat-calendar-body-label {
        color: #ffffff !important;
      }

      .mat-calendar-body-cell {
        color: #ffffff !important;
        
        &:hover {
          background: rgba(233, 69, 96, 0.15) !important;
        }
        
        &.mat-calendar-body-active {
          background: #e94560 !important;
          color: white !important;
        }

        &.mat-calendar-body-today {
          border-color: #e94560 !important;
          color: #e94560 !important;
        }
      }

      .mat-calendar-body-today {
        border-color: #e94560 !important;
      }

      .mat-calendar-table-header {
        color: #ffffff !important;
      }

      .mat-calendar-table-header-divider {
        border-top-color: rgba(255, 255, 255, 0.2) !important;
      }

      .mat-calendar-body-cell-content {
        color: #ffffff !important;
      }

      .mat-calendar-body-selected {
        background-color: #e94560 !important;
        color: white !important;
      }

      .mat-calendar-body-today.mat-calendar-body-selected {
        box-shadow: inset 0 0 0 1px white !important;
      }

      .mat-mdc-form-field-icon-suffix {
        color: #ffffff;
      }

      .mat-mdc-slider {
        --mdc-slider-handle-color: #e94560;
        --mdc-slider-focus-handle-color: #e94560;
        --mdc-slider-with-tick-marks-active-container-color: #e94560;
        --mat-slider-ripple-color: rgba(233, 69, 96, 0.1);
        --mat-slider-hover-ripple-color: rgba(233, 69, 96, 0.2);
        --mat-slider-focus-ripple-color: rgba(233, 69, 96, 0.3);
      }

      .mat-mdc-slider-track-fill {
        background-color: #e94560 !important;
      }

      .mat-mdc-slider-track-background {
        background-color: rgba(255, 255, 255, 0.2) !important;
      }

      .mat-mdc-slider-thumb-label {
        background-color: #e94560 !important;
      }

      .mat-mdc-slider-thumb-label-text {
        color: white !important;
      }

      .mat-datepicker-toggle {
        color: #ffffff !important;
      }

      .mat-datepicker-content {
        background: #2d2d2d !important;
        color: #ffffff !important;
      }

      .mat-calendar-arrow {
        border-top-color: #ffffff !important;
      }

      .mat-calendar-previous-button,
      .mat-calendar-next-button {
        color: #ffffff !important;
      }

      .mat-mdc-input-element::placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
      }

      .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-form-field-infix {
        color: #ffffff !important;
      }

      .mat-mdc-form-field.mat-focused .mat-mdc-form-field-flex .mat-mdc-form-field-infix {
        color: #ffffff !important;
      }

      .mat-mdc-form-field .mat-mdc-form-field-flex .mat-mdc-form-field-infix {
        color: #ffffff !important;
      }

      .mat-mdc-form-field .mat-mdc-form-field-flex .mat-mdc-form-field-infix input::placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
      }

      .mat-mdc-form-field .mat-mdc-form-field-flex .mat-mdc-form-field-infix textarea::placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
      }
    }

    @media (max-width: 600px) {
      .add-weight-button {
        padding: 10px 16px;
        font-size: 0.9rem;
        
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .form-container {
        margin-top: 16px;
        border-radius: 12px;
        
        &.expanded {
          padding: 12px;
        }
      }

      .form-header {
        .header-content {
          gap: 8px;
          
          .header-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
          
          h3 {
            font-size: 1.1rem;
          }
        }

        .close-button {
          padding: 6px;
          
          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }

      .form-grid {
        gap: 8px;
        margin-bottom: 8px;
      }

      .input-card {
        padding: 12px;

        .input-header {
          margin-bottom: 8px;
          
          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
          
          span {
            font-size: 0.9rem;
          }
        }
      }

      .weight-display {
        .weight-value {
          font-size: 1.5rem;
        }
        
        .weight-unit {
          font-size: 0.9rem;
        }
      }

      .weight-range {
        font-size: 0.7rem;
      }

      .form-actions {
        gap: 6px;
        margin-top: 8px;
        padding-top: 8px;
      }

      .cancel-button, .submit-button {
        padding: 3px 10px;
        font-size: 0.9rem;
        
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }
  `]
})
export class AddWeightModalComponent implements OnChanges, OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitMeasurement = new EventEmitter<Partial<WeightProgress>>();

  weightForm: FormGroup;
  weightControl: FormControl;
  currentWeight: number = 70;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.weightControl = new FormControl(70, [Validators.required, Validators.min(30), Validators.max(200)]);
    this.weightForm = this.fb.group({
      weight: this.weightControl,
      measurementDate: [new Date(), Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.weightControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.currentWeight = value;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      // Reset form when opening
      this.weightForm.reset({
        weight: 70,
        measurementDate: new Date(),
        notes: ''
      });
    }
  }

  toggleExpansion(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.closeModal.emit();
    }
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
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closeModal.emit();
  }
} 