import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

interface Client {
  id: string;
  name: string;
}

interface SessionFormData {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  clientId?: string;
  status?: string;
}

@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class SessionFormComponent {
  sessionForm: FormGroup;
  isEditMode: boolean = false;
  clients: Client[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SessionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { session?: SessionFormData }
  ) {
    this.isEditMode = !!data?.session;
    this.sessionForm = this.fb.group({
      title: [data?.session?.title || '', Validators.required],
      start: [data?.session?.start || '', Validators.required],
      end: [data?.session?.end || '', Validators.required],
      clientId: [data?.session?.clientId || '', Validators.required]
    });

    // Update end time when start time changes
    this.sessionForm.get('start')?.valueChanges.subscribe(start => {
      if (start) {
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        this.sessionForm.patchValue({ end });
      }
    });
  }

  submitForm(): void {
    if (this.sessionForm.valid) {
      this.dialogRef.close(this.sessionForm.value);
    }
  }

  deleteSession(): void {
    if (this.data?.session) {
      this.dialogRef.close({ delete: true, id: this.data.session.clientId });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 