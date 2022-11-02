import { Component, OnInit } from '@angular/core';
import { combosBD } from '@app/bd/combos.model';
import { comboInterface } from '@app/models/combo.interface';
import {
  faEye,
  faHeart,
  faShoppingCart,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
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
  faHeart = faHeart;
  faEye = faEye;
  faShoppingCart = faShoppingCart;
  faStar = faStar;
  CombosBD!: comboInterface[];
  container!: HTMLElement;
  cards!: comboInterface[];
  wrapper!: HTMLElement;
  window: Window = window;

  constructor() {}

  ngOnInit(): void {
    this.CombosBD = combosBD.filter((combo) => combo.estrellas === 5);
    this.cards = combosBD.filter((combo) => combo.estrellas !== 5);

    if (!this.CombosBD.length) {
      combosBD.sort(function (a: any, b: any) {
        return b.estrellas - a.estrellas;
      });
      this.CombosBD = combosBD.splice(0, 3);
      this.cards = combosBD;
    }
  }

  getDetails(card: comboInterface) {
    alert(`
    Nombre plato: ${card.nombre}

    <img src="${card.img}"></img>

    Ref: ${card.REF}

    Ingredientes: ${card.ingredientes}
    
    precio: ${card.precio}
    `);
  }
}
