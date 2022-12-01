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
          this.user = this.localStorageService.get('user', {})!;
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

  addToCar(REF: String, i?: number) {
    this.pedidos = this.localStorageService.get<[pedidoInterface]>(
      'pedido',
      {}
    )!;

    if (i) {
      let list = this.document.querySelectorAll('.action')[i];

      this.renderer.addClass(list, 'active');
    }

    if (this.pedidos) {
      this.pedidos.push({ REF, cantidad: 1 });

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
        if (response.isConfirmed) this.router.navigate(['/login', REF]);
        else {
          this.localStorageService.set('pedido', [{ REF, cantidad: 1 }], {});
          this.ngOnInit();
        }
      });
  }

  existeComboPedido(REF: String, pedidos: pedidoInterface[]): Boolean {
    if (pedidos?.length)
      pedidos = pedidos.filter((pedido) => pedido.REF === REF);

    return !pedidos?.length;
  }

  restCar(REF: String) {
    this.pedidos = this.pedidos.filter((pedido) => {
      if (pedido.REF === REF && pedido.cantidad! > 1) pedido.cantidad!--;
      else if (pedido.REF === REF && pedido.cantidad! == 1) return false;

      return pedido;
    });

    this.localStorageService.set('pedido', this.pedidos, {});
  }

  addCar(REF: String) {
    this.pedidos = this.pedidos.map((pedido) => {
      if (pedido.REF === REF) pedido.cantidad!++;

      return pedido;
    });

    this.localStorageService.set('pedido', this.pedidos, {});
  }

  getCantidadCombos(REF: String) {
    let cantidad;
    this.pedidos.forEach((pedido) => {
      if (pedido.REF === REF) cantidad = pedido.cantidad;
    });

    return cantidad;
  }

  addFavorite(id: String) {
    this.spinner
      .show()
      .then(() =>
        this.combosService
          .addRemoveFavorite(id)
          .subscribe((res) => this.ngOnInit())
      );
  }
}
