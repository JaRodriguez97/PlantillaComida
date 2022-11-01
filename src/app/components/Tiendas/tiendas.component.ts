import { campusInterface } from './../../models/campus.interface';
import { Component, OnInit } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Campus } from '@app/bd/campus.model';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
})
export class TiendasComponent implements OnInit {
  map!: google.maps.Map;
  campus!: campusInterface[];
  containerMap!: HTMLCollectionOf<Element>;
  container!: HTMLCollectionOf<Element>;
  slicerContainerMap!: HTMLDivElement;
  iframe!: HTMLElement | null;
  url!: string;
  params!: URLSearchParams;
  variable!: string | null;
  coords: any;
  window: Window = window;
  faStar = faStar;
  marker!: google.maps.Marker;

  constructor(private mapsAPILoader: MapsAPILoader) {}

  ngOnInit(): void {
    this.containerMap =
      this.window.document.getElementsByClassName('containerMap');
    this.container = this.window.document.getElementsByClassName('container');
    this.slicerContainerMap = this.window.document.createElement('div');
    this.iframe = this.window.document.getElementById('map');
    this.campus = Campus;

    this.window.addEventListener('resize', this.mediaScreen.bind(this));

    this.mediaScreen();
    this.mapsAPILoader.load().then(() => {
      let zoom = 15,
        lat,
        lng,
        center,
        mapTypeId = google.maps.MapTypeId.HYBRID,
        zoomControl = true,
        streetViewControl = true,
        disableDefaultUI = true,
        clickableIcons = true,
        fullscreenControl = false;

      this.window.navigator.geolocation.getCurrentPosition(
        (e) => {
          lat = e.coords.latitude;
          lng = e.coords.longitude;
          center = new google.maps.LatLng(lat, lng);
          
          this.map = new google.maps.Map(document.getElementById('map')!, {
            zoom,
            center,
            mapTypeId,
            zoomControl,
            streetViewControl,
            disableDefaultUI,
            clickableIcons,
            fullscreenControl,
          });

          this.marker = new google.maps.Marker({
            position: center,
            map: this.map,
          });
        },
        (err) => console.error(err)
      );
    });
  }

  mediaScreen() {
    for (let index = 0; index <= this.containerMap.length; index++) {
      let containerMapI = this.containerMap[index];

      if (!containerMapI) return;

      if (this.window.innerWidth > 991) {
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

  getTienda(tienda: campusInterface) {
    this.slicerContainerMap.classList.add('active');
    console.log(
      '🚀 ~ file: tiendas.component.ts ~ line 71 ~ TiendasComponent ~ getTienda ~ this.slicerContainerMap.classList',
      this.slicerContainerMap.classList
    );

    // if (this.slicerContainerMap.innerHTML.indexOf(ubicacion) === -1) {
    //   this.slicerContainerMap.innerHTML += `<p>¿Cómo llegar a ${ubicacion}?</p>`;

    //   // (this.container[0] as HTMLElement).onclick = this.outMap;
    // }
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
  //   this.window.location.href = `http://127.0.0.1:5500/Tiendas/tiendas.html?variable=${JSON.stringify(
  //     selected
  //   )}`;
  // }
}
