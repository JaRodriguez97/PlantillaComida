import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { userInterface } from '@models/users.interface';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from 'ngx-spinner';
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
  window: Window = window;

  constructor(
    private renderer: Renderer2,
    public router: Router,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    if (window.scrollY > 0)
      return this.renderer.addClass(this.header.nativeElement, 'sticky');

    this.renderer.removeClass(this.header.nativeElement, 'sticky');
  }

  ngOnInit(): void {
    this.user = this.localStorageService.get('user', {})!;
  }

  public onActivate(event: Event) {
    console.log(
      '🚀 ~ file: app.component.ts ~ line 48 ~ AppComponent ~ onActivate ~ event.constructor.name',
      event.constructor.name
    );
    console.log(
      '🚀 ~ file: app.component.ts ~ line 49 ~ AppComponent ~ onActivate ~ window',
      this.document
    );
    // if (event.constructor.name === 'ComboComponent') {
    // this.document.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // });
    // }
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

      // this.spinner.spinnerObservable.subscribe(
      //   (res) => {
      //     if (res.show) this.spinner.hide();
      //   },
      //   (err) => console.error(err)
      // );
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
    })
      .then(() => this.redirectTo('/login'))
      .then(() => (this.user = undefined))
      .then(() => this.localStorageService.clear());
  }
}
