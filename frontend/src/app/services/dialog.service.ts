import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogStateSubject = new BehaviorSubject<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  dialogState$ = this.dialogStateSubject.asObservable();

  constructor() {}

  openDialog(title: string, message: string): void {
    this.dialogStateSubject.next({
      isOpen: true,
      title,
      message
    });
  }

  closeDialog(): void {
    this.dialogStateSubject.next({
      ...this.dialogStateSubject.value,
      isOpen: false
    });
  }
} 