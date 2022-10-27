import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PlantillaComida';
  header: HTMLElement | null = null;
  menuToggle: any;
  menu: any;

  @HostListener('window:scroll')
  scrolling(): void {
    this.header = document.querySelector('header')!;
    this.header.classList.toggle('sticky', window.scrollY > 0);
  }

  ngOnInit(): void {}

  // Menú toggle
  toogleMenu(redirecTo?: string): any[] {
    this.menuToggle = document.querySelector('.toggle')!;
    this.menu = document.querySelector('.menu')!;
    this.menuToggle.classList.toggle('active');
    this.menu.classList.toggle('active');

    console.log(redirecTo);

    return [redirecTo];
  }
}
