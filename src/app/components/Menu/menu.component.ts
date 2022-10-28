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
  cards!: HTMLCollectionOf<Element>;
  wrapper!: HTMLElement;
  window: Window = window;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    /* Assigning the variable container to the element with the id of container. */
    this.container = this.document.getElementById('container')!;
    /* Assigning the variable cards to the elements with the class of col-sm-4. */
    this.cards = this.document.getElementsByClassName('col-sm-4')!;
    /* Assigning the variable wrapper to the element with the id of row. */
    this.wrapper = this.document.getElementById('row')!;
    /* Calling the function. */
    this.mediaScreen();
    /* Listening for the window to resize and then calling the mediaScreen function. */
    window.addEventListener('resize', this.mediaScreen.bind(this));

    this.CombosBD = combosBD;
  }

  mediaScreen() {
    if (window.innerWidth > 991) {
      this.container.classList.remove('swiper-container');
      this.wrapper.classList.remove('swiper-wrapper');
      this.wrapper.classList.add('row');
      for (let index = 0; index < this.cards.length; index++) {
        this.cards[index].classList.remove('swiper-slide');
        if (index === 1) this.cards[index].classList.add('scale');
      }
      return;
    }

    this.wrapper.classList.add('swiper-wrapper');
    this.wrapper.classList.remove('row');
    this.container.classList.add('swiper-container');
    for (let index = 0; index < this.cards.length; index++) {
      this.cards[index].classList.add('swiper-slide');
      if (index === 1) this.cards[index].classList.remove('scale');
    }
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
