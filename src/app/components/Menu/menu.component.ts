import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {
  faCheckCircle,
  faEye,
  faHeart,
  faShoppingCart,
  faStar
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
  Pagination
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
    public appComponent: AppComponent,
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
    this.spinner.show().then(() => {
      if (typeof i == 'number') {
        let list = this.document.querySelectorAll('.action')[i];

        this.renderer.addClass(list, 'active');
      }

      if (!this.user) {
        if (!this.pedidos) {
          this.spinner.hide().then(() => {
            Swal.fire({
              icon: 'question',
              title: 'NO ESTÁ REGISTRADO',
              html: `<h4>Desea ingresar antes de hacer su pedido?</h4>
        <h6 style="font-size:10px">Si marca NO podrá hacer su pedido sin
        ningún problema, pero de manera anónima.</h6>`,
              showCancelButton: true,
              cancelButtonText: 'Quiero hacer mi pedido ya',
              confirmButtonText: 'Deseo ingresar a mi cuenta',
              scrollbarPadding: false,
            }).then((response) => {
              if (response.isConfirmed) this.router.navigate(['/login', _id]);
              else {
                this.pedidos.push({ _id, cantidad: 1 });
                this.localStorageService.set('pedido', this.pedidos, {});
                this.ngOnInit();
                this.appComponent.ngOnInit();
              }
            });
          });
        } else {
          this.pedidos.push({ _id, cantidad: 1 });
          this.localStorageService.set('pedido', this.pedidos, {});
          this.ngOnInit();
          this.appComponent.ngOnInit();
        }
      } else {
        this.pedidos.push({ _id, cantidad: 1 });

        this.usersService
          .updateUser(this.userID, this.pedidos, 'pedido')
          .subscribe(
            (res) => {
              console.log(
                '🚀 ~ file: menu.component.ts:171 ~ MenuComponent ~ addToCar ~ res',
                res
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
            () => {
              this.ngOnInit();
              this.appComponent.ngOnInit();
            }
          );
      }
    });
  }

  existeComboPedido(_id: String, pedidos: pedidoInterface[]): Boolean {
    if (pedidos && pedidos.length)
      pedidos = pedidos.filter((pedido) => pedido._id === _id);

    return !pedidos?.length || false;
  }

  restCar(_id: String) {
    this.appComponent.restCar(_id).then(() => this.ngOnInit());
  }

  addCarCantidad(_id: String) {
    this.appComponent.addCarCantidad(_id).then(() => this.ngOnInit());
  }
}
