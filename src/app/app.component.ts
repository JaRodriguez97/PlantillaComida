import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  Renderer2,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { userInterface } from '@models/users.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PlantillaComida';
  user!: userInterface | undefined;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('toggle') menuToggle!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  constructor(private renderer: Renderer2, public router: Router) {}

  @HostListener('window:scroll')
  scrolling(): void {
    if (window.scrollY > 0)
      return this.renderer.addClass(this.header.nativeElement, 'sticky');

    this.renderer.removeClass(this.header.nativeElement, 'sticky');
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
  }
  // Menú toggle
  toogleMenu() {
    let toggleMenu = this.menuToggle.nativeElement,
      menu = this.menu.nativeElement,
      existe = [toggleMenu.classList].filter(
        (classN) => classN.value.indexOf('active') !== -1
      );

    if (existe.length) {
      this.renderer.removeClass(toggleMenu, 'active');
      this.renderer.removeClass(menu, 'active');
    } else {
      this.renderer.addClass(toggleMenu, 'active');
      this.renderer.addClass(menu, 'active');
    }
  }

  redirectTo(str: string) {
    this.renderer.removeClass(this.menuToggle.nativeElement, 'active');
    this.renderer.removeClass(this.menu.nativeElement, 'active');

    this.router.navigate([str]);
  }

  logOut() {
    this.user = undefined;
    Swal.fire({
      // imageUrl: 'assets/images/Icono Mercury.png',
      icon: 'success',
      imageWidth: 100,
      confirmButtonColor: '#007bff',
      html: '<b>Sesión Cerrada Exitósamente</b>',
    }).then(() =>
      this.router.navigate(['/login']).then(() => localStorage.clear())
    );
  }
}
