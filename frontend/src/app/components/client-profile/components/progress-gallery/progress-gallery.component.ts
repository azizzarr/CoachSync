import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PhotoModalComponent } from './photo-modal/photo-modal.component';
import { AddProgressPhotoComponent } from '../add-progress-photo/add-progress-photo.component';

export interface ProgressPhoto {
  id: string;
  imageUrl: string;
  category: string;
  date: Date;
  weight: number;
  notes?: string;
}

@Component({
  selector: 'app-progress-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    AddProgressPhotoComponent
  ],
  templateUrl: './progress-gallery.component.html',
  styleUrls: ['./progress-gallery.component.scss']
})
export class ProgressGalleryComponent implements OnInit {
  @Input() photos: ProgressPhoto[] = [];
  isCollapsed = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load photos if not provided via input
    if (!this.photos.length) {
      this.loadPhotos();
    }
  }

  loadPhotos() {
    // TODO: Implement photo loading from service
    this.photos = [
      {
        id: '1',
        imageUrl: 'assets/images/progress/front.jpg',
        category: 'front',
        date: new Date(),
        weight: 75,
        notes: 'Feeling great!'
      },
      // Add more sample photos
    ];
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      front: 'Front View',
      back: 'Back View',
      side: 'Side View'
    };
    return labels[category] || 'Photo';
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      front: 'person',
      back: 'person_outline',
      side: 'view_side'
    };
    return icons[category] || 'photo_camera';
  }

  openPhotoModal(photo: ProgressPhoto): void {
    this.dialog.open(PhotoModalComponent, {
      data: photo,
      panelClass: 'photo-modal-overlay',
      maxWidth: '100vw',
      width: '100vw',
      height: '100vh',
      disableClose: true
    });
  }

  openAddPhotoModal(): void {
    const dialogRef = this.dialog.open(AddProgressPhotoComponent, {
      width: '100%',
      maxWidth: '600px',
      panelClass: 'add-photo-modal',
      disableClose: true
    });

    dialogRef.componentInstance.photoAdded.subscribe((photo: ProgressPhoto) => {
      this.photos.unshift(photo);
      dialogRef.close();
    });

    dialogRef.componentInstance.cancelled.subscribe(() => {
      dialogRef.close();
    });
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
} 