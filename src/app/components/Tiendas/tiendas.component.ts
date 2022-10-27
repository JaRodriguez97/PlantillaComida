import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
})
export class TiendasComponent implements OnInit {
  window: Window = window;

  constructor() {}

  ngOnInit(): void {
    this.window.addEventListener('resize', function (params) {
      console.log(window.innerHeight, params);
    });
  }

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
