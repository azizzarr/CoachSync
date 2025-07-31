import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { ProgressPhoto } from '../progress-gallery/progress-gallery.component';

@Component({
  selector: 'app-add-progress-photo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
    MatTabsModule,
    MatRadioModule,
    MatSliderModule
  ],
  template: `
    <div class="add-photo-container">
      <div class="modal-header">
        <h2>Add Progress Photo</h2>
      </div>

      <div class="content-wrapper">
        <div class="photo-section">
          <div class="photo-card" (click)="fileInput.click()" [class.has-image]="previewUrl">
            <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" style="display: none">
            
            <div class="upload-content" *ngIf="!previewUrl">
              <div class="upload-icon">
                <mat-icon>add_photo_alternate</mat-icon>
              </div>
              <div class="upload-text">
                <span class="primary-text">Click to upload photo</span>
              </div>
            </div>
            
            <div class="preview-container" *ngIf="previewUrl">
              <img [src]="previewUrl" alt="Preview">
              <div class="preview-overlay">
                <button mat-icon-button class="change-photo-btn" (click)="fileInput.click(); $event.stopPropagation()">
                  <mat-icon>edit</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <form [formGroup]="photoForm" (ngSubmit)="onSubmit()" class="photo-form">
            <div class="form-row">
              <div class="input-card">
                <div class="input-label">
                  <mat-icon>person</mat-icon>
                  <span>View</span>
                </div>
                <mat-radio-group formControlName="category" class="radio-group">
                  <mat-radio-button value="front" class="radio-button">
                    <div class="radio-content">
                      <mat-icon>person</mat-icon>
                      <span>Front</span>
                    </div>
                  </mat-radio-button>
                  <mat-radio-button value="back" class="radio-button">
                    <div class="radio-content">
                      <mat-icon>person_outline</mat-icon>
                      <span>Back</span>
                    </div>
                  </mat-radio-button>
                  <mat-radio-button value="side" class="radio-button">
                    <div class="radio-content">
                      <mat-icon>view_side</mat-icon>
                      <span>Side</span>
                    </div>
                  </mat-radio-button>
                </mat-radio-group>
              </div>
              
              <div class="input-card">
                <div class="input-label">
                  <mat-icon>calendar_today</mat-icon>
                  <span>Date</span>
                </div>
                <mat-form-field appearance="fill">
                  <input matInput [matDatepicker]="picker" formControlName="date">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              </div>
            </div>

            <div class="form-row">
              <div class="input-card">
                <div class="input-label">
                  <mat-icon>scale</mat-icon>
                  <span>Weight</span>
                </div>
                <div class="slider-container">
                  <mat-slider min="40" max="150" step="0.5" discrete>
                    <input matSliderThumb formControlName="weight">
                  </mat-slider>
                  <div class="slider-value">{{ photoForm.get('weight')?.value || 0 }} kg</div>
                </div>
              </div>
              
              <div class="input-card">
                <div class="input-label">
                  <mat-icon>percent</mat-icon>
                  <span>Body Fat</span>
                </div>
                <div class="slider-container">
                  <mat-slider min="5" max="40" step="0.5" discrete>
                    <input matSliderThumb formControlName="bodyFat">
                  </mat-slider>
                  <div class="slider-value">{{ photoForm.get('bodyFat')?.value || 0 }}%</div>
                </div>
              </div>
            </div>

            <div class="input-card full-width">
              <div class="input-label">
                <mat-icon>note</mat-icon>
                <span>Notes</span>
              </div>
              <mat-form-field appearance="fill" class="full-width">
                <textarea matInput formControlName="notes" rows="2" placeholder="Add notes about your progress..."></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" class="cancel-btn" (click)="onCancel()">
                Cancel
              </button>
              <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="!photoForm.valid || !selectedFile">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-photo-container {
      padding: 12px;
      background: #1e1e2f;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      color: #fff;
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
    }

    .modal-header {
      text-align: center;
      margin-bottom: 12px;

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        background: linear-gradient(90deg, #4facfe, #00f2fe);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .photo-section {
      width: 100%;
    }

    .photo-card {
      width: 100%;
      height: 140px;
      border-radius: 6px;
      overflow: hidden;
      background: #2a2a3c;
      border: 2px dashed rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        border-color: #4facfe;
        background: rgba(79, 172, 254, 0.05);
      }

      &.has-image {
        border: none;
      }
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      padding: 12px;
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: white;
      }
    }

    .upload-text {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .primary-text {
        font-size: 0.9rem;
        font-weight: 500;
        color: white;
      }
    }

    .preview-container {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover .preview-overlay {
        opacity: 1;
      }

      .change-photo-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
      }
    }

    .form-section {
      width: 100%;
    }

    .photo-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 8px;
    }

    .input-card {
      flex: 1;
      background: #2a2a3c;
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .full-width {
      width: 100%;
    }

    .input-label {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #4facfe;
      font-weight: 500;
      font-size: 0.85rem;

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .radio-button {
      margin-right: 0;
      
      ::ng-deep .mdc-form-field {
        width: 100%;
      }
    }

    .radio-content {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 2px 0;

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        color: rgba(255, 255, 255, 0.7);
      }

      span {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .slider-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 4px 0;
    }

    .slider-value {
      text-align: right;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 2px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .cancel-btn {
      color: rgba(255, 255, 255, 0.7);
      min-width: 70px;
      font-size: 0.85rem;

      &:hover {
        color: white;
      }
    }

    .submit-btn {
      background: linear-gradient(90deg, #4facfe, #00f2fe);
      color: white;
      min-width: 80px;
      font-size: 0.85rem;
      transition: all 0.3s ease;

      &:hover:not([disabled]) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
      }

      &:disabled {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.3);
      }
    }

    ::ng-deep {
      .mat-mdc-form-field {
        width: 100%;
      }

      .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .mat-mdc-form-field-flex {
        background-color: #1e1e2f !important;
        border-radius: 4px !important;
        padding: 0 8px !important;
      }

      .mat-mdc-text-field-wrapper {
        background-color: transparent !important;
        padding: 0 !important;
      }

      .mat-mdc-form-field-focus-overlay {
        background-color: transparent !important;
      }

      .mat-mdc-form-field-infix {
        padding-top: 6px !important;
        padding-bottom: 6px !important;
        min-height: unset !important;
      }

      .mat-mdc-form-field-icon-suffix {
        color: rgba(255, 255, 255, 0.5);
      }

      .mat-mdc-select-value-text {
        color: white !important;
        font-size: 0.85rem !important;
      }

      .mat-mdc-select-arrow {
        color: rgba(255, 255, 255, 0.5) !important;
      }

      .mat-mdc-form-field-label {
        color: rgba(255, 255, 255, 0.7) !important;
        font-size: 0.85rem !important;
      }

      .mat-mdc-input-element {
        color: white !important;
        font-size: 0.85rem !important;
      }

      .mat-mdc-form-field-outline {
        color: rgba(255, 255, 255, 0.1) !important;
      }

      .mat-mdc-form-field-outline-thick {
        color: rgba(79, 172, 254, 0.5) !important;
      }

      .mat-mdc-radio-button {
        --mdc-radio-selected-focus-state-layer-color: #4facfe;
        --mdc-radio-selected-hover-state-layer-color: #4facfe;
        --mdc-radio-selected-pressed-state-layer-color: #4facfe;
        --mdc-radio-selected-icon-color: #4facfe;
        --mdc-radio-selected-focus-icon-color: #4facfe;
        --mdc-radio-selected-hover-icon-color: #4facfe;
        --mdc-radio-selected-pressed-icon-color: #4facfe;
      }

      .mat-mdc-slider {
        --mdc-slider-handle-color: #4facfe;
        --mdc-slider-focus-handle-color: #4facfe;
        --mdc-slider-with-tick-marks-active-container-color: #4facfe;
        --mat-mdc-slider-ripple-color: #4facfe;
        --mat-mdc-slider-hover-ripple-color: #4facfe;
        --mat-mdc-slider-focus-ripple-color: #4facfe;
        --mdc-slider-active-track-color: #4facfe;
        --mdc-slider-inactive-track-color: rgba(255, 255, 255, 0.2);
        --mdc-slider-with-tick-marks-inactive-container-color: rgba(255, 255, 255, 0.2);
      }

      .mat-mdc-dialog-container {
        --mdc-dialog-container-color: transparent !important;
        padding: 0 !important;
      }

      .mat-mdc-dialog-surface {
        background: transparent !important;
        box-shadow: none !important;
      }
    }

    @media (max-width: 600px) {
      .add-photo-container {
        padding: 8px;
        max-width: 100%;
        border-radius: 0;
      }

      .modal-header {
        margin-bottom: 8px;
        
        h2 {
          font-size: 1.1rem;
        }
      }

      .content-wrapper {
        gap: 8px;
      }

      .form-row {
        flex-direction: column;
        gap: 8px;
      }

      .photo-card {
        height: 120px;
      }

      .input-card {
        padding: 6px;
      }

      .radio-group {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .radio-button {
        flex: 1 0 30%;
        margin-bottom: 4px;
      }

      .radio-content {
        justify-content: center;
        text-align: center;
      }

      .slider-container {
        padding: 2px 0;
      }

      .form-actions {
        flex-direction: row;
        justify-content: space-between;
        margin-top: 6px;
      }

      .submit-btn, .cancel-btn {
        flex: 1;
        min-width: unset;
        padding: 0 8px;
      }

      ::ng-deep {
        .mat-mdc-form-field-infix {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }

        .mat-mdc-form-field-flex {
          padding: 0 6px !important;
        }
      }
    }

    @media (max-width: 400px) {
      .add-photo-container {
        padding: 6px;
      }

      .photo-card {
        height: 100px;
      }

      .upload-icon {
        width: 40px;
        height: 40px;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .radio-button {
        flex: 1 0 45%;
      }

      .input-label {
        font-size: 0.8rem;
      }

      .radio-content span {
        font-size: 0.8rem;
      }
    }

    /* Additional mobile optimizations */
    @media (max-width: 360px) {
      .add-photo-container {
        padding: 4px;
      }

      .modal-header {
        margin-bottom: 4px;
        
        h2 {
          font-size: 1rem;
        }
      }

      .content-wrapper {
        gap: 6px;
      }

      .photo-card {
        height: 90px;
      }

      .upload-icon {
        width: 36px;
        height: 36px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .upload-text .primary-text {
        font-size: 0.8rem;
      }

      .input-card {
        padding: 4px;
      }

      .input-label {
        font-size: 0.75rem;
      }

      .radio-button {
        flex: 1 0 100%;
        margin-bottom: 2px;
      }

      .radio-content {
        padding: 4px 0;
      }

      .radio-content span {
        font-size: 0.75rem;
      }

      .slider-container {
        padding: 0;
      }

      .slider-value {
        font-size: 0.75rem;
      }

      .form-actions {
        margin-top: 4px;
        gap: 4px;
      }

      .submit-btn, .cancel-btn {
        font-size: 0.75rem;
        padding: 0 4px;
        height: 32px;
        line-height: 32px;
      }

      ::ng-deep {
        .mat-mdc-form-field-infix {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }

        .mat-mdc-form-field-flex {
          padding: 0 4px !important;
        }

        .mat-mdc-form-field-label {
          font-size: 0.75rem !important;
        }

        .mat-mdc-input-element {
          font-size: 0.75rem !important;
        }

        .mat-mdc-select-value-text {
          font-size: 0.75rem !important;
        }

        .mat-mdc-button {
          min-height: 32px !important;
          padding: 0 8px !important;
        }

        .mat-mdc-raised-button {
          min-height: 32px !important;
          padding: 0 8px !important;
        }
      }
    }

    /* Fix for very small screens */
    @media (max-height: 600px) {
      .add-photo-container {
        max-height: 100vh;
        overflow-y: auto;
      }

      .photo-card {
        height: 80px;
      }

      .form-row {
        gap: 4px;
      }

      .input-card {
        padding: 4px;
      }

      .form-actions {
        margin-top: 4px;
      }
    }
  `]
})
export class AddProgressPhotoComponent {
  @Output() photoAdded = new EventEmitter<ProgressPhoto>();
  @Output() cancelled = new EventEmitter<void>();

  photoForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder) {
    this.photoForm = this.fb.group({
      category: ['front', Validators.required],
      date: [new Date(), Validators.required],
      weight: [70, [Validators.required, Validators.min(0)]],
      bodyFat: [15, [Validators.min(0), Validators.max(100)]],
      notes: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.createPreview();
    }
  }

  private createPreview(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.photoForm.valid && this.selectedFile) {
      const photo: ProgressPhoto = {
        id: Date.now().toString(),
        imageUrl: this.previewUrl || '',
        category: this.photoForm.get('category')?.value,
        date: this.photoForm.get('date')?.value,
        weight: this.photoForm.get('weight')?.value,
        notes: this.photoForm.get('notes')?.value || ''
      };
      this.photoAdded.emit(photo);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
} 