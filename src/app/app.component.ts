import { CombosService } from './services/Combos/combos.service';
import { pedidoInterface } from './models/pedido.interface';
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
  totalPedido!: number;
  pedidosLength!: number;
  user!: userInterface | undefined;
  userID!: String;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('toggle') menuToggle!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @ViewChild('pedido') pedidoSection!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private combosService: CombosService,
    public router: Router,
    public localStorageService: LocalStorageService,
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
    this.totalPedido = 0;
    this.pedidosLength = 1;

    let pedidoStorage = this.localStorageService.get<pedidoInterface[]>(
      'pedido',
      {}
    );
    this.userID = this.localStorageService.get('userID', {})!;

    if (this.userID && this.userID.length)
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
        () => {
          this.combosService
            .getTotalPedido(this.user?.pedido?.map((pedido) => pedido._id)!)
            .subscribe((res) => {
              this.totalPedido = res.reduce((accumulator, currentValue) => {
                this.pedidosLength = this.user?.pedido?.length!;
                this.user?.pedido?.forEach((combo) => {
                  if (combo._id == currentValue._id)
                    currentValue.precio = combo.cantidad! * currentValue.precio;
                });
                return accumulator + currentValue.precio;
              }, this.totalPedido);
            });
        }
      );
    else if (pedidoStorage && pedidoStorage.length) {
      this.combosService
        .getTotalPedido(pedidoStorage.map((pedido) => pedido._id))
        .subscribe((res) => {
          this.totalPedido = res.reduce((accumulator, currentValue) => {
            this.pedidosLength = pedidoStorage?.length!;
            pedidoStorage?.forEach((combo) => {
              if (combo._id == currentValue._id)
                currentValue.precio = combo.cantidad! * currentValue.precio;
            });
            return accumulator + currentValue.precio;
          }, this.totalPedido);
        });
    }
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
    this.renderer.removeClass(this.menuToggle.nativeElement, 'active');
    this.renderer.removeClass(this.menu.nativeElement, 'active');
    this.router.navigate([str]);
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

  activePedido(): Boolean {
    let pedi = this.localStorageService.get<pedidoInterface[]>('pedido', {});
    if (this.user && this.user.pedido && this.user.pedido.length) return true;

    if (pedi && pedi.length) return true;

    return false;
  }

  screenPedido(): void {
    if (!this.pedidoSection.nativeElement.classList.contains('screen'))
      this.renderer.addClass(this.pedidoSection.nativeElement, 'screen');
    else this.renderer.removeClass(this.pedidoSection.nativeElement, 'screen');
  }
}
