import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
})
export class TiendasComponent implements OnInit {
  containerMap!: HTMLCollectionOf<Element>;
  container!: HTMLCollectionOf<Element>;
  slicerContainerMap!: HTMLDivElement;
  iframe!: HTMLElement | null;
  url!: string;
  params!: URLSearchParams;
  variable!: string | null;
  coords: any;
  window: Window = window;

  constructor() {}

  ngOnInit(): void {
    this.containerMap =
      this.window.document.getElementsByClassName('containerMap');
    this.container = this.window.document.getElementsByClassName('container');
    this.slicerContainerMap = this.window.document.createElement('div');
    this.iframe = this.window.document.getElementById('map');
    this.url = this.window.location.search;
    this.params = new URLSearchParams(this.url);
    this.variable = this.params.get('variable')!;
    this.coords = JSON.parse(this.variable);

    this.window.addEventListener('resize', this.mediaScreen.bind(this));

    this.window.navigator.geolocation.getCurrentPosition((e) => {
      this.iframe!.setAttribute(
        'src',
        `https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d63722.35692481782!2d
  -76.53861581049388!3d3.4357090597903213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d${e.coords.latitude}426!2d
  ${e.coords.longitude}3589999999!4m5!1s0x8e30a870cbef36f9%3A0x942af3718e0f286b!2smigueliz%20burgers!3m2!1d3.4875951!2d
  -76.48926949999999!5e0!3m2!1ses!2sco!4v1665963554998!5m2!1ses!2sco`
      );
    });

    this.mediaScreen();
  }

  mediaScreen() {
    for (let index = 0; index <= this.containerMap.length; index++) {
      let containerMapI = this.containerMap[index];

      if (!containerMapI) return;

      if (window.innerWidth > 991) {
        for (let i = 0; i <= this.container.length; i++) {
          let ele = this.container[i];
          if (ele) ele.appendChild(containerMapI);
        }
        return;
      }

      this.slicerContainerMap.classList.add('slicerContainerMap');
      this.slicerContainerMap.appendChild(containerMapI);
      for (let i = 0; i < this.container.length; i++) {
        let ele = this.container[i];
        if (ele) ele.appendChild(this.slicerContainerMap);
      }
    }
  }

  getTienda(ubicacion: string) {
    this.slicerContainerMap.classList.add('active');
    console.log(
      '🚀 ~ file: tiendas.component.ts ~ line 71 ~ TiendasComponent ~ getTienda ~ this.slicerContainerMap.classList',
      this.slicerContainerMap.classList
    );

    if (this.slicerContainerMap.innerHTML.indexOf(ubicacion) === -1) {
      this.slicerContainerMap.innerHTML += `<p>¿Cómo llegar a ${ubicacion}?</p>`;

      // (this.container[0] as HTMLElement).onclick = this.outMap;
    }
  }

  // outMap() {
  //   this.slicerContainerMap.classList.remove('active');
  // }

  // function getTienda(sede) {
  //   let tiendas = {
  //       sanLuis: { latitud: 3.4878423036440855, longitud: -76.48925727538456 },
  //       alcazares: { latitud: 3.4865036822974127, longitud: -76.4893216483981 },
  //       centro: { latitud: 3.452023550257599, longitud: -76.5286213166757 },
  //     },
  //     selected = tiendas[sede];
  //   console.log("🚀 ~ file: app.js ~ line 30 ~ getTienda ~ selected", selected);
  //   window.location.href = `http://127.0.0.1:5500/Tiendas/tiendas.html?variable=${JSON.stringify(
  //     selected
  //   )}`;
  // }
}
