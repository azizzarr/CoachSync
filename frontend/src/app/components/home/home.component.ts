import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    HeaderComponent,
    FooterComponent
  ],
  template: `
  <app-header></app-header>
    <!-- Hero Section -->
    <app-hero></app-hero>
<app-footer></app-footer>
  
    <!-- Search model -->
    <div class="search-model">
        <div class="h-100 d-flex align-items-center justify-content-center">
            <div class="search-close-switch">+</div>
            <form class="search-model-form">
                <input type="text" id="search-input" placeholder="Search here.....">
            </form>
        </div>
    </div>
  `,
  styles: [`
    .search-model {
      display: none;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.9);
    }
    .search-close-switch {
      position: absolute;
      width: 50px;
      height: 50px;
      background: #f36100;
      color: #ffffff;
      text-align: center;
      border-radius: 50%;
      font-size: 28px;
      line-height: 50px;
      top: 30px;
      right: 30px;
      cursor: pointer;
    }
    .search-model-form {
      width: 500px;
    }
    .search-model-form input {
      width: 100%;
      font-size: 16px;
      border: none;
      border-bottom: 2px solid #ffffff;
      background: none;
      color: #ffffff;
      padding-bottom: 15px;
    }
    .search-model-form input::placeholder {
      color: #ffffff;
    }
  `]
})
export class HomeComponent {
  // Add any component logic here
} 