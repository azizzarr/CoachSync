import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserProfileService, UserProfileDTO } from '../../services/user-profile.service';
import { AuthService } from '../../services/auth.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class OnboardingComponent implements OnInit {
  currentStep = 1;
  totalSteps = 5;
  personalInfoForm!: FormGroup;
  physicalInfoForm!: FormGroup;
  fitnessGoalsForm!: FormGroup;
  preferencesForm!: FormGroup;
  isSubmitting = false;
  showWelcome = false;

  activityLevels = [
    { value: 'SEDENTARY', label: 'Sedentary', description: 'Little or no exercise', icon: 'coffee' },
    { value: 'LIGHTLY_ACTIVE', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', icon: 'directions_walk' },
    { value: 'MODERATELY_ACTIVE', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', icon: 'hiking' },
    { value: 'VERY_ACTIVE', label: 'Very Active', description: 'Hard exercise 6-7 days/week', icon: 'fitness_center' },
    { value: 'EXTRA_ACTIVE', label: 'Extra Active', description: 'Very hard exercise & physical job', icon: 'sports_martial_arts' }
  ];

  fitnessGoals = [
    { value: 'LOSE_WEIGHT', label: 'Lose Weight', icon: 'monitor_weight_loss' },
    { value: 'BUILD_MUSCLE', label: 'Build Muscle', icon: 'sports_gymnastics' },
    { value: 'IMPROVE_FITNESS', label: 'Improve Fitness', icon: 'sports_score' },
    { value: 'MAINTAIN', label: 'Maintain Weight', icon: 'balance' }
  ];

  workoutLocations = [
    { value: 'GYM', label: 'Gym', icon: 'sports_gymnastics' },
    { value: 'HOME', label: 'Home', icon: 'home_repair_service' },
    { value: 'OUTDOOR', label: 'Outdoor', icon: 'landscape' },
    { value: 'MIXED', label: 'Mixed', icon: 'sync_alt' }
  ];

  workoutTimes = [
    { value: 'MORNING', label: 'Morning', description: '5AM - 11AM', icon: 'wb_twilight' },
    { value: 'AFTERNOON', label: 'Afternoon', description: '11AM - 4PM', icon: 'wb_sunny' },
    { value: 'EVENING', label: 'Evening', description: '4PM - 9PM', icon: 'nightlight_round' },
    { value: 'NIGHT', label: 'Night', description: '9PM - 5AM', icon: 'dark_mode' }
  ];

  equipmentOptions = [
    { value: 'DUMBBELLS', label: 'Dumbbells', icon: 'fitness_center' },
    { value: 'RESISTANCE_BANDS', label: 'Resistance Bands', icon: 'sports_handball' },
    { value: 'YOGA_MAT', label: 'Yoga Mat', icon: 'self_improvement' },
    { value: 'CARDIO_MACHINE', label: 'Cardio Machine', icon: 'directions_run' },
    { value: 'NONE', label: 'No Equipment', icon: 'sports_gymnastics' }
  ];

  healthConditions = [
    { value: 'NONE', label: 'None' },
    { value: 'HEART_CONDITION', label: 'Heart Condition' },
    { value: 'DIABETES', label: 'Diabetes' },
    { value: 'HYPERTENSION', label: 'Hypertension' },
    { value: 'ASTHMA', label: 'Asthma' },
    { value: 'JOINT_PAIN', label: 'Joint Pain' },
    { value: 'OTHER', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userProfileService: UserProfileService,
    private authService: AuthService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {}

  private initializeForms(): void {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.physicalInfoForm = this.fb.group({
      height: [170, [Validators.required, Validators.min(100), Validators.max(250)]],
      weight: [70, [Validators.required, Validators.min(30), Validators.max(300)]],
      activityLevel: ['MODERATELY_ACTIVE', Validators.required]
    });

    this.fitnessGoalsForm = this.fb.group({
      primaryGoal: ['', Validators.required],
      targetWeight: [70, Validators.required],
      weeklyWorkoutDays: [3, Validators.required]
    });

    this.preferencesForm = this.fb.group({
      preferredWorkoutTime: ['', Validators.required],
      workoutLocation: ['', Validators.required],
      equipmentAccess: [[], Validators.required],
      healthConditions: ['']
    });
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    this.currentStep--;
  }

  private validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        if (this.personalInfoForm.valid) {
          return true;
        }
        this.markFormGroupTouched(this.personalInfoForm);
        return false;
      case 2:
        if (this.physicalInfoForm.valid) {
          return true;
        }
        this.markFormGroupTouched(this.physicalInfoForm);
        return false;
      case 3:
        if (this.fitnessGoalsForm.valid) {
          return true;
        }
        this.markFormGroupTouched(this.fitnessGoalsForm);
        return false;
      case 4:
        if (this.preferencesForm.valid) {
          return true;
        }
        this.markFormGroupTouched(this.preferencesForm);
        return false;
      default:
        return false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit(): void {
    if (this.currentStep === 4 && this.validateCurrentStep()) {
      this.isSubmitting = true;
      
      const user = this.authService.getCurrentUser();
      if (!user) {
        console.error('No user found');
        this.isSubmitting = false;
        return;
      }

      const profileData: UserProfileDTO = {
        dateOfBirth: formatDate(this.personalInfoForm.get('dateOfBirth')?.value, 'yyyy-MM-dd', 'en-US'),
        gender: this.personalInfoForm.get('gender')?.value.toUpperCase(),
        height: this.physicalInfoForm.get('height')?.value,
        currentWeight: this.physicalInfoForm.get('weight')?.value,
        targetWeight: this.fitnessGoalsForm.get('targetWeight')?.value,
        activityLevel: this.physicalInfoForm.get('activityLevel')?.value,
        fitnessGoals: this.fitnessGoalsForm.get('primaryGoal')?.value,
        workoutLocations: this.preferencesForm.get('workoutLocation')?.value,
        workoutTimes: this.preferencesForm.get('preferredWorkoutTime')?.value,
        availableEquipment: this.preferencesForm.get('equipmentAccess')?.value[0] || 'NONE',
        healthConditions: this.preferencesForm.get('healthConditions')?.value || 'NONE',
        otherHealthCondition: null
      };

      this.userProfileService.createProfile(user.uid, profileData).subscribe({
        next: (response) => {
        //  console.log('Profile created successfully:', response);
          this.isSubmitting = false;
          this.showWelcome = true;
          this.currentStep = 5;
        },
        error: (error) => {
          console.error('Error creating profile:', error);
          this.isSubmitting = false;
          // Handle error appropriately
        }
      });
    }
  }

  startJourney() {
    this.router.navigate(['/dashboard']);
  }

  toggleEquipment(equipment: string): void {
    const currentEquipment = this.preferencesForm.get('equipmentAccess')?.value || [];
    const index = currentEquipment.indexOf(equipment);
    
    if (index === -1) {
      currentEquipment.push(equipment);
    } else {
      currentEquipment.splice(index, 1);
    }
    
    this.preferencesForm.patchValue({ equipmentAccess: currentEquipment });
  }

  isEquipmentSelected(equipment: string): boolean {
    return (this.preferencesForm.get('equipmentAccess')?.value || []).includes(equipment);
  }
} 