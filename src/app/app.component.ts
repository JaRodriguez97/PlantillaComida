import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PlantillaComida';
  header!: HTMLElement | null;
  @ViewChild('toggle') menuToggle!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  constructor(private renderer: Renderer2) {}

  @HostListener('window:scroll')
  scrolling(): void {
    this.header = document.querySelector('header')!;
    this.header.classList.toggle('sticky', window.scrollY > 0);
  }

  ngOnInit(): void {}

  // Menú toggle
  toogleMenu(redirecTo?: string): any[] {
    // this.menu = document.querySelector('.menu')!;
    if ([this.menuToggle.nativeElement.classList].indexOf('active') == -1)
      this.renderer.addClass(this.menuToggle.nativeElement, 'active');
    else this.renderer.removeClass(this.menuToggle.nativeElement, 'active');
    // this.menuToggle.classList.toggle('active');
    // this.menu.classList.toggle('active');
    this.menuToggle.nativeElement.classList.filter((classN: string) => {
      console.log(
        '🚀 ~ file: app.component.ts ~ line 39 ~ AppComponent ~ this.menuToggle.nativeElement.classList.filter ~ classN',
        classN
      );
      return (classN = 'active');
    });
    return [redirecTo];
  }
}
