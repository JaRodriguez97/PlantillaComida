import { campusInterface } from '@app/models/campus.interface';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Campus } from '@app/bd/campus.model';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
})
export class TiendasComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('containerMap') containerMap!: ElementRef;

  map!: google.maps.Map;
  campus!: campusInterface[];
  slicerContainerMap!: Node;
  url!: string;
  params!: URLSearchParams;
  variable!: string | null;
  coords: any;
  window: Window = window;
  faStar = faStar;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.slicerContainerMap = this.renderer.createElement('div');
    this.renderer.addClass(this.slicerContainerMap, 'slicerContainerMap');

    this.mapsAPILoader.load().then(() => {
      let zoom = 17,
        lat,
        lng,
        center,
        mapTypeId = google.maps.MapTypeId.ROADMAP,
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

          new google.maps.Marker({
            position: center,
            map: this.map,
            title: 'Estás aquí',
            optimized: true,
          });
        },
        (err) => console.error(err)
      );
    });
  }

  ngAfterViewInit(): void {
    this.window.addEventListener('resize', this.mediaScreen.bind(this));
    this.campus = Campus;

    this.mediaScreen();
  }

  mediaScreen() {
    if (this.window.innerWidth > 991)
      return this.renderer.appendChild(
        this.container.nativeElement,
        this.containerMap.nativeElement
      );

    this.renderer.appendChild(
      this.slicerContainerMap,
      this.containerMap.nativeElement
    );
    this.renderer.appendChild(
      this.container.nativeElement,
      this.slicerContainerMap
    );
  }

  getTienda(tienda: campusInterface) {
    this.renderer.addClass(this.slicerContainerMap, 'active');

    let position = new google.maps.LatLng(tienda.coordenadas),
      title = `Sede: ${tienda.sede}`;

    new google.maps.Marker({
      map: this.map,
      position,
      title,
    });
    
    if (this.window.innerWidth > 991) this.map.setZoom(13.2);
    else this.map.setZoom(12.5);

    this.window.navigator.geolocation.getCurrentPosition((e) => {
      let lat = e.coords.latitude,
        lng = e.coords.longitude,
        coordLat = tienda.coordenadas.lat - lat,
        coordLng = tienda.coordenadas.lng - lng,
        center;

      lat = coordLat / 2 + lat;
      lng = coordLng / 2 + lng;

      center = new google.maps.LatLng(lat, lng);

      this.map.setCenter(center);
    });
    // if (this.slicerContainerMap.innerHTML.indexOf(ubicacion) === -1) {
    //   this.slicerContainerMap.innerHTML += `<p>¿Cómo llegar a ${ubicacion}?</p>`;

    //   // (this.container[0] as HTMLElement).onclick = this.outMap;
    // }
  }

  // outMap() {
  //   this.slicerContainerMap.classList.remove('active');
  // }
}
