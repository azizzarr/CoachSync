import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class JQueryService {
  private jqueryLoaded = new BehaviorSubject<boolean>(false);
  private owlCarouselLoaded = new BehaviorSubject<boolean>(false);

  constructor() {
    //console.log('JQueryService initialized');
    this.loadJQuery();
  }

  private loadJQuery() {
    //console.log('Loading jQuery...');
    if (window.jQuery) {
      //console.log('jQuery already loaded');
      this.jqueryLoaded.next(true);
      this.loadOwlCarousel();
    } else {
      const script = document.createElement('script');
      script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
      script.type = 'text/javascript';
      script.onload = () => {
       // console.log('jQuery loaded successfully');
        this.jqueryLoaded.next(true);
        this.loadOwlCarousel();
      };
      script.onerror = (error) => {
        console.error('Failed to load jQuery:', error);
      };
      document.head.appendChild(script);
    }
  }

  private loadOwlCarousel() {
    //console.log('Loading Owl Carousel...');
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
      //console.log('Owl Carousel already loaded');
      this.owlCarouselLoaded.next(true);
    } else {
      // First load the CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css';
      document.head.appendChild(cssLink);

      // Then load the JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js';
      script.type = 'text/javascript';
      script.onload = () => {
       // console.log('Owl Carousel loaded successfully');
        this.owlCarouselLoaded.next(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Owl Carousel:', error);
      };
      document.head.appendChild(script);
    }
  }

  getJQueryLoaded(): Observable<boolean> {
    return this.jqueryLoaded.asObservable();
  }

  getOwlCarouselLoaded(): Observable<boolean> {
    return this.owlCarouselLoaded.asObservable();
  }

  getJQuery(): any {
    return window.jQuery;
  }
} 