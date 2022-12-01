import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { comboInterface } from '@app/models/combo.interface';
import { pedidoInterface } from '@app/models/pedido.interface';
import {
  faEye,
  faHeart,
  faShoppingCart,
  faStar,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { userInterface } from '@models/users.interface';
import { CombosService } from '@service/Combos/combos.service';
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

  constructor(
    private renderer: Renderer2,
    private combosService: CombosService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.spinner.show().then(() => {
      this.combosService.getCombos().subscribe(
        (res) => {
          this.CombosBD = res.filter((combo) => combo.estrellas === 5);
          this.cards = res.filter((combo) => combo.estrellas !== 5);
          this.pedidos = this.localStorageService.get<[pedidoInterface]>(
            'pedido',
            {}
          )!;

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
            });
          }),
        () => this.spinner.hide()
      );
    });
  }

  getDetails(_id: String) {
    this.spinner.show().then(() => this.router.navigate(['/combo', _id]));
  }

  addToCar(id: String, i?: number) {
    let cantidadCombos: number;

    this.user = this.localStorageService.get('user', {})!;
    this.pedidos = this.localStorageService.get<[pedidoInterface]>(
      'pedido',
      {}
    )!;

    if (i) {
      let list = this.document.querySelectorAll('.action')[i];

      this.renderer.addClass(list, 'active');
    }

    if (this.pedidos) {
      this.pedidos.forEach((pedido) => {
        if (pedido.id === id) {
          cantidadCombos = pedido.cantidad!;
        }
      });

      if (!cantidadCombos!) this.pedidos.push({ id, cantidad: 1 });

      this.localStorageService.set('pedido', this.pedidos, {});
    } else if (!this.user)
      Swal.fire({
        icon: 'question',
        title: 'NO ESTÁ REGISTRADO',
        html: `<h4>Desea ingresar antes de hacer su pedido?</h4>
        <h6 style="font-size:5px">Si marca NO podrá hacer su pedido sin
        ningún problema, pero de manera anónima.</h6>`,
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SÍ',
        scrollbarPadding: false,
      }).then((response) => {
        if (response.isConfirmed) this.router.navigate(['/login', id]);
        else {
          this.localStorageService.set('pedido', [{ id, cantidad: 1 }], {});
          this.ngOnInit();
        }
      });
  }

  existeComboPedido(_id: String, pedidos: pedidoInterface[]): Boolean {
    if (pedidos?.length)
      pedidos = pedidos.filter((pedido) => pedido.id === _id);

    return !pedidos?.length;
  }

  restCar(id: String) {
    this.pedidos = this.pedidos.map((pedido) => {
      if (pedido.id === id) {
        pedido.cantidad!--;
      }
      return pedido;
    });

    this.localStorageService.set('pedido', this.pedidos, {});
  }

  addCar(id: String) {
    this.pedidos = this.pedidos.map((pedido) => {
      if (pedido.id === id) {
        pedido.cantidad!++;
      }
      return pedido;
    });

    this.localStorageService.set('pedido', this.pedidos, {});
  }

  getCantidadCombos(id: String) {
    let cantidad;
    this.pedidos.forEach((pedido) => {
      if (pedido.id === id) cantidad = pedido.cantidad;
    });

    return cantidad;
  }
}
