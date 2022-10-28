import { cardInterface } from '@app/models/cards.interface';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, {
  EffectCards,
  Pagination,
  Navigation,
  Autoplay,
} from 'swiper';
import { combosBD } from '@app/bd/combos.model';
import { cardsBD } from '@app/bd/cards.model';
import { comboInterface } from '@app/models/combo.interface';

SwiperCore.use([EffectCards, Pagination, Navigation, Autoplay]);

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  CombosBD!: comboInterface[];
  container!: HTMLElement;
  cards!: cardInterface[];
  wrapper!: HTMLElement;
  window: Window = window;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.CombosBD = combosBD;
    this.cards = cardsBD;
  }

  getDetails(p: number) {
    let content = this.document.getElementsByClassName('content'),
      children = content[p].children;

    alert(
      `
    Nombre plato: ${(children[0].children[0] as HTMLElement).innerText}

    foto

    Ref: ${(children[0].children[1] as HTMLElement).innerText}

    descripción: Lorem ipsum dolor, sit amet consectetur adipisicing
    elit. Qui Dexercitationem id aperiam. Iste perspiciatis dignissimos
    ad, ea, non qui sapiente omnis labore commodi ut voluptates,
    molestiae unde optio aut vel?
    
    precio: ${(children[1].children[0] as HTMLElement).innerText}
    `
    );
  }
}
