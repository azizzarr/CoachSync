import { Component, AfterViewInit, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { JQueryService } from '../../services/jquery.service';
import { takeUntil, filter, take } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit, OnInit, OnDestroy {
  private scrollTimeout: any;
  private isScrolling = false;
  private destroy$ = new Subject<void>();
  private owlCarouselInitialized = false;

  userEmail: string | null = null;
  idToken: string | null = null;

  constructor(
    private authService: AuthService,
    private jQueryService: JQueryService
  ) {
    // console.log('HeroComponent initialized');
  }

  slides = [
    {
      image: 'assets/img/hero/hero-1.jpg',
      title: 'Connect with <strong>Expert Coaches</strong>',
      subtitle: 'Personalized Fitness Journey'
    },
    {
      image: 'assets/img/hero/hero-2.jpg',
      title: 'Track Your <strong>Progress</strong>',
      subtitle: 'AI-Powered Workout Plans'
    }
  ];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Debounce scroll events
    if (!this.isScrolling) {
      this.isScrolling = true;
      requestAnimationFrame(() => {
        this.handleScroll();
        this.isScrolling = false;
      });
    }
  }

  ngOnInit() {
    // console.log('HeroComponent ngOnInit');
    // Add smooth scroll class to body
    document.body.classList.add('smooth-scroll');

    // Subscribe to auth state
    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.authService.getIdToken().then(token => {
          this.idToken = token;
          // console.log('Firebase ID Token in HeroComponent:', token);
        });
      }
    });
  }

  ngOnDestroy() {
    // console.log('HeroComponent ngOnDestroy');
    // Remove smooth scroll class from body
    document.body.classList.remove('smooth-scroll');
    // Clear any pending timeouts
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    // Destroy Owl Carousel if it was initialized
    if (this.owlCarouselInitialized) {
      const $ = this.jQueryService.getJQuery();
      if ($) {
        // console.log('Destroying Owl Carousel');
        $('.hs-slider').trigger('destroy.owl.carousel');
      }
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleScroll() {
    // Optimize scroll performance by using requestAnimationFrame
    if (this.scrollTimeout) {
      cancelAnimationFrame(this.scrollTimeout);
    }

    this.scrollTimeout = requestAnimationFrame(() => {
      // Add any scroll-based animations or effects here
    });
  }

  private initializeOwlCarousel() {
    // console.log('Initializing Owl Carousel');
    const $ = this.jQueryService.getJQuery();
    if (!$) {
      // console.warn('jQuery is not loaded yet');
      return;
    }

    try {
      const slider = $('.hs-slider');
      if (!slider.length) {
        // console.warn('Slider element not found');
        return;
      }

      // console.log('Found slider element, initializing Owl Carousel');
      slider.owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        smartSpeed: 800,
        autoHeight: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        lazyLoad: true,
        touchDrag: true,
        mouseDrag: true,
        responsive: {
          0: {
            items: 1
          }
        }
      });
      this.owlCarouselInitialized = true;
      // console.log('Owl Carousel initialized successfully');
    } catch (error) {
      // console.error('Error initializing Owl Carousel:', error);
    }
  }

  private initializeBackgroundImages() {
    // console.log('Initializing background images');
    const $ = this.jQueryService.getJQuery();
    if (!$) {
      // console.warn('jQuery is not loaded yet');
      return;
    }

    const elements = $('.set-bg');
    // console.log(`Found ${elements.length} elements with set-bg class`);

    elements.each(function(this: HTMLElement) {
      const bg = $(this).data('setbg');
      if (bg) {
        // console.log(`Loading background image: ${bg}`);
        const img = new Image();
        img.onload = () => {
          $(this).css('background-image', `url(${bg})`);
          // console.log(`Background image loaded: ${bg}`);
        };
        img.onerror = (error) => {
          // console.error(`Failed to load background image: ${bg}`, error);
        };
        img.src = bg;
      }
    });
  }

  ngAfterViewInit() {
    // console.log('HeroComponent ngAfterViewInit');
    // Wait for both jQuery and Owl Carousel to be loaded
    combineLatest([
      this.jQueryService.getJQueryLoaded(),
      this.jQueryService.getOwlCarouselLoaded()
    ]).pipe(
      filter(([jqueryLoaded, owlLoaded]) => jqueryLoaded && owlLoaded),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // console.log('Both jQuery and Owl Carousel are loaded, initializing...');
      this.initializeOwlCarousel();
      this.initializeBackgroundImages();
    });
  }
}
