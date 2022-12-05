import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { userInterface } from '@models/users.interface';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import { getWindow } from 'ssr-window';
import Swal from 'sweetalert2';
import { UsersService } from './services/Users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PlantillaComida';
  user!: userInterface | undefined;
  userID!: String;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('toggle') menuToggle!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  constructor(
    private renderer: Renderer2,
    public router: Router,
    private localStorageService: LocalStorageService,
    private usersService: UsersService,
    private spinner: NgxSpinnerService
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    if (window.scrollY > 0)
      return this.renderer.addClass(this.header.nativeElement, 'sticky');

    this.renderer.removeClass(this.header.nativeElement, 'sticky');
  }

  ngOnInit(): void {
    this.userID = this.localStorageService.get('userID', {})!;

    this.usersService.getUser(this.userID).subscribe(
      (res) => (this.user = res),
      (err) =>
        this.spinner.hide().then(() => {
          console.error(err);
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err.error.message,
            scrollbarPadding: false,
          });
        }),
      () => {}
    );
  }

  onActivate(event: Event) {
    if (getWindow().scroll)
      getWindow().scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
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
    this.spinner.show().then(() => {
      this.renderer.removeClass(this.menuToggle.nativeElement, 'active');
      this.renderer.removeClass(this.menu.nativeElement, 'active');
      this.router.navigate([str]);
    });
  }

  logOut() {
    Swal.fire({
      icon: 'success',
      imageWidth: 100,
      confirmButtonColor: '#000',
      confirmButtonAriaLabel: '',
      html: '<b>Sesión Cerrada Exitosamente</b>',
      scrollbarPadding: false,
    })
      .then(() => this.redirectTo('/login'))
      .then(() => (this.user = undefined))
      .then(() => this.localStorageService.clear());
  }
}
