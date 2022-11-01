import { cardInterface } from '@app/models/cards.interface';
import {
  faHeart,
  faEye,
  faShoppingCart,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from 'swiper';
import { combosBD } from '@app/bd/combos.model';
import { cardsBD } from '@app/bd/cards.model';
import { comboInterface } from '@app/models/combo.interface';

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
  cards!: cardInterface[];
  wrapper!: HTMLElement;
  window: Window = window;

  constructor() {}

  ngOnInit(): void {
    this.CombosBD = combosBD;
    this.cards = cardsBD;
  }

  getDetails(card: cardInterface) {
    alert(`
    Nombre plato: ${card.nombre}

    <img src="${card.img}"></img>

    Ref: ${card.REF}

    Ingredientes: ${card.Ingredientes}
    
    precio: ${card.precio}
    `);
  }
}
