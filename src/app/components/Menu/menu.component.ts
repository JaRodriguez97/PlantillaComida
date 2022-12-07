import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {
  faCheckCircle,
  faEye,
  faHeart,
  faShoppingCart,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { comboInterface } from '@models/combo.interface';
import { pedidoInterface } from '@models/pedido.interface';
import { userInterface } from '@models/users.interface';
import { CombosService } from '@service/Combos/combos.service';
import { UsersService } from '@service/Users/users.service';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import SwiperCore, {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper';

SwiperCore.use([EffectCoverflow, Pagination, Navigation, Autoplay]);

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  CombosBD!: comboInterface[];
  container!: HTMLElement;
  cards!: comboInterface[];
  faHeart = faHeart;
  faEye = faEye;
  faShoppingCart = faShoppingCart;
  faStar = faStar;
  faCheckCircle = faCheckCircle;
  pedidos!: pedidoInterface[];
  wrapper!: HTMLElement;
  window: Window = window;
  user!: userInterface | undefined;
  userID!: String;

  constructor(
    private appComponent: AppComponent,
    private renderer: Renderer2,
    private usersService: UsersService,
    private combosService: CombosService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.spinner.show().then(() => {
      this.userID = this.localStorageService.get<String>('userID', {})!;

      this.combosService.getCombos().subscribe(
        (res) => {
          this.CombosBD = res.filter((combo) => combo.estrellas === 5);
          this.cards = res.filter((combo) => combo.estrellas !== 5);

          if (!this.CombosBD.length) {
            res.sort(function (a: any, b: any) {
              return b.estrellas - a.estrellas;
            });
            this.CombosBD = res.splice(0, 3);
            this.cards = res;
          }
        },
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
          if (this.userID)
            this.usersService.getUser(this.userID).subscribe(
              (res) => {
                this.user = res;
                this.appComponent.user = res;
                this.pedidos = this.user.pedido!;
                console.log(
                  '🚀 ~ file: menu.component.ts:94 ~ MenuComponent ~ this.spinner.show ~ this.pedidos',
                  this.pedidos
                );
              },
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
              () => this.spinner.hide()
            );
          else {
            this.pedidos =
              this.localStorageService.get<[pedidoInterface]>('pedido', {})! ||
              [];
            this.spinner.hide();
          }
        }
      );
    });
  }

  getDetails(_id: String) {
    this.spinner.show().then(() => this.router.navigate(['/combo', _id]));
  }

  addToCar(_id: String, i?: number) {
    if (typeof i == 'number') {
      let list = this.document.querySelectorAll('.action')[i];

      this.renderer.addClass(list, 'active');
    }

    if (!this.user) {
      if (!this.pedidos.length)
        Swal.fire({
          icon: 'question',
          title: 'NO ESTÁ REGISTRADO',
          html: `<h4>Desea ingresar antes de hacer su pedido?</h4>
        <h6 style="font-size:6px">Si marca NO podrá hacer su pedido sin
        ningún problema, pero de manera anónima.</h6>`,
          showCancelButton: true,
          cancelButtonText: 'NO',
          confirmButtonText: 'SÍ',
          scrollbarPadding: false,
        }).then((response) => {
          if (response.isConfirmed) this.router.navigate(['/login', _id]);
          else {
            this.pedidos.push({ _id, cantidad: 1 });
            this.localStorageService.set('pedido', this.pedidos, {});
            this.ngOnInit();
          }
        });
      else {
        this.pedidos.push({ _id, cantidad: 1 });
        this.localStorageService.set('pedido', this.pedidos, {});
        this.ngOnInit();
      }
    } else {
      this.pedidos.push({ _id, cantidad: 1 });

      this.usersService
        .updateUser(this.userID, this.pedidos, 'pedido')
        .subscribe((res) => {
          console.log(
            '🚀 ~ file: menu.component.ts:139 ~ MenuComponent ~ .subscribe ~ res',
            res
          );
        });
    }
  }

  existeComboPedido(_id: String, pedidos: pedidoInterface[]): Boolean {
    if (pedidos.length)
      pedidos = pedidos.filter((pedido) => pedido._id === _id);

    return !pedidos.length;
  }

  restCar(_id: String) {
    this.pedidos = this.pedidos.filter((pedido) => {
      if (pedido._id === _id && pedido.cantidad! > 1) pedido.cantidad!--;
      else if (pedido._id === _id && pedido.cantidad! == 1) return false;

      return pedido;
    });

    this.localStorageService.set('pedido', this.pedidos, {});
  }

  addCarCantidad(_id: String) {
    this.pedidos = this.pedidos.map((pedido) => {
      if (pedido._id === _id) pedido.cantidad!++;

      return pedido;
    });

    this.localStorageService.set('pedido', this.pedidos, {});
  }

  getCantidadCombos(_id: String) {
    let cantidad;
    this.pedidos.forEach((pedido) => {
      if (pedido._id === _id) cantidad = pedido.cantidad;
    });

    return cantidad;
  }

  addFavorite(_id: String) {
    this.spinner.show().then(() => {
      if (this.user) {
        if (this.user.favoritos) {
          if (this.user.favoritos.length) {
            let index = this.user.favoritos.indexOf(_id);

            if (index == -1) this.user.favoritos.push(_id);
            else this.user.favoritos!.splice(index, 1);
          } else this.user.favoritos.push(_id);
        } else {
          this.user.favoritos = [];
          this.user.favoritos.push(_id);
        }

        this.usersService
          .updateUser(this.user._id, this.user.favoritos, 'favoritos')
          .subscribe(
            (res) => this.ngOnInit(),
            (err) =>
              this.spinner.hide().then(() => {
                console.error(err);
                Swal.fire({
                  confirmButtonColor: '#000',
                  icon: 'error',
                  html: err.error.message,
                  scrollbarPadding: false,
                });
              })
          );
      } else {
        this.spinner.hide();
        Swal.fire({
          icon: 'question',
          title: 'NO HAS INICIADO SESIÓN',
          text: 'Registrate antes para poder marcar como favorito',
          showCancelButton: true,
          scrollbarPadding: false,
        }).then((response) => {
          if (response.value) this.router.navigate(['/login']);
        });
      }
    });
  }

  validateFavorite(_id: String): Boolean {
    if (this.user && this.user.favoritos && this.user.favoritos.length)
      if (this.user.favoritos.indexOf(_id) !== -1) return true;

    return false;
  }
}
