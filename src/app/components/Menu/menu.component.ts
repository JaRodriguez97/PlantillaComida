import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { comboInterface } from '@app/models/combo.interface';
import {
  faEye,
  faHeart,
  faShoppingCart,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { CombosService } from '@service/Combos/combos.service';
import SwiperCore, {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper';
import { NgxSpinnerService } from 'ngx-spinner';

SwiperCore.use([EffectCoverflow, Pagination, Navigation, Autoplay]);

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  faHeart = faHeart;
  faEye = faEye;
  faShoppingCart = faShoppingCart;
  faStar = faStar;
  CombosBD!: comboInterface[];
  container!: HTMLElement;
  cards!: comboInterface[];
  wrapper!: HTMLElement;
  window: Window = window;

  constructor(
    private combosService: CombosService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show().then(() => {
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
            });
          }),
        () => this.spinner.hide()
      );
    });
  }

  getDetails(_id: String) {
    this.spinner.show().then(() => this.router.navigate(['/combo', _id]));
  }
}
