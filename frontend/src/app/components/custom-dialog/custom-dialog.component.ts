import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="isOpen" (click)="close()">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>{{ title }}</h2>
          <button class="close-button" (click)="close()">×</button>
        </div>
        <div class="dialog-content">
          <p>{{ message }}</p>
        </div>
        <div class="dialog-actions">
          <button class="btn btn-primary" (click)="onLoginClick()">Login</button>
          <button class="btn btn-secondary" (click)="close()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .dialog-container {
      background-color: #1a1a1a;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 500px;
      overflow: hidden;
      border: 1px solid #333;
      animation: slideIn 0.3s ease-in-out;
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #333;
      background-color: #222;
    }
    
    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #ffffff;
      font-weight: 600;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      transition: color 0.3s ease;
    }
    
    .close-button:hover {
      color: #f36100;
    }
    
    .dialog-content {
      padding: 24px;
      color: #ffffff;
      font-size: 1rem;
      line-height: 1.5;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid #333;
      gap: 12px;
      background-color: #222;
    }
    
    .btn {
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Poppins', sans-serif;
    }
    
    .btn-primary {
      background-color: #f36100;
      color: white;
      border: none;
    }
    
    .btn-primary:hover {
      background-color: #e05a00;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(243, 97, 0, 0.3);
    }
    
    .btn-secondary {
      background-color: #333;
      color: #ffffff;
      border: 1px solid #444;
    }
    
    .btn-secondary:hover {
      background-color: #444;
      transform: translateY(-2px);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class CustomDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Authentication Required';
  @Input() message: string = 'You need to sign in to access this page.';
  @Output() closeDialog = new EventEmitter<void>();
  
  constructor(private router: Router) {}
  
  close(): void {
    this.closeDialog.emit();
  }
  
  onLoginClick(): void {
    this.close();
    this.router.navigate(['/login']);
  }
} 