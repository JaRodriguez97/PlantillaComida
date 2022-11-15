import { MapsAPILoader } from '@agm/core';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
// import { Campus } from '@app/bd/campus.model';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { campusInterface } from '@models/campus.interface';
import { TiendasService } from '@service/Tiendas/tiendas.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
})
export class TiendasComponent implements OnInit {
  @ViewChild('body') body!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('containerMap') containerMap!: ElementRef;
  @ViewChild('slicerContainerMap') slicerContainerMap!: ElementRef;
  @ViewChild('hideSilceMap') hideSilceMap!: ElementRef;

  map!: google.maps.Map;
  campus!: campusInterface[];
  // slicerContainerMap!: any;
  url!: string;
  params!: URLSearchParams;
  variable!: string | null;
  coords: any;
  window: Window = window;
  faStar = faStar;
  marker!: google.maps.Marker;
  tiendaSeleccionada!: campusInterface | undefined;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router: Router,
    private tiendasServices: TiendasService
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    // if (this.window.scrollY < 30) {
    //   this.renderer.removeClass(
    //     this.slicerContainerMap.nativeElement,
    //     'active'
    //   );
    //   this.renderer.removeClass(this.container.nativeElement, 'sticky');
    //   this.renderer.removeClass(this.body.nativeElement, 'sticky');
    // }
    // this.renderer.removeClass(this.header.nativeElement, 'sticky');
  }

  ngOnInit(): void {
    this.spinner.show().then(() => {
      this.tiendasServices.getTiendas().subscribe(
        (res) => {
          this.campus = res;
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

                this.map = new google.maps.Map(
                  document.getElementById('map')!,
                  {
                    zoom,
                    center,
                    mapTypeId,
                    zoomControl,
                    streetViewControl,
                    disableDefaultUI,
                    clickableIcons,
                    fullscreenControl,
                  }
                );

                new google.maps.Marker({
                  position: center,
                  map: this.map,
                  title: 'Estás aquí',
                  optimized: true,
                });
              },
              (err) => console.error(err)
            );
            this.window.addEventListener('resize', this.mediaScreen.bind(this));
          });
        },
        (err) => {
          console.error(err);
        },
        () => this.mediaScreen().then(() => this.spinner.hide())
      );
    });
  }

  async mediaScreen() {
    if (this.window.innerWidth > 991)
      return this.renderer.appendChild(
        this.container.nativeElement,
        this.containerMap.nativeElement
      );

    this.renderer.appendChild(
      this.slicerContainerMap.nativeElement,
      this.containerMap.nativeElement
    );

    this.renderer.appendChild(
      this.container.nativeElement,
      this.slicerContainerMap.nativeElement
    );
  }

  getTienda(tienda: campusInterface) {
    this.spinner
      .show()
      .then(() => {
        setTimeout(() => {
          if (this.window.innerWidth < 991) {
            this.tiendaSeleccionada = tienda;

            this.renderer.addClass(
              this.slicerContainerMap.nativeElement,
              'active'
            );

            this.renderer.addClass(this.container.nativeElement, 'sticky');
            this.renderer.addClass(this.body.nativeElement, 'sticky');
            this.map.setZoom(12.4);
          } else this.map.setZoom(13.4);

          let position = new google.maps.LatLng(tienda.coordenadas),
            title = `Sede: ${tienda.sede}`;

          if (!this.marker) {
            this.marker = new google.maps.Marker({
              map: this.map,
              position,
              title,
            });
          } else this.marker.setPosition(position);

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

          // this.renderer.setAttribute(
          //   this.slicerContainerMap,
          //   'innerHTML',
          //   `<p>¿Cómo llegar a ${tienda.sede}?</p>`
          // );
          // if (this.slicerContainerMap.innerHTML.indexOf(ubicacion) === -1) {
          //   this.slicerContainerMap.innerHTML += `<p>¿Cómo llegar a ${ubicacion}?</p>`;

          //   // (this.container[0] as HTMLElement).onclick = this.outMap;
          // }
        }, 500);
      })
      .then(() => setTimeout(() => this.spinner.hide(), 1000));
  }

  outMap() {
    this.renderer.removeClass(this.slicerContainerMap.nativeElement, 'active');
    this.renderer.removeClass(this.container.nativeElement, 'sticky');
    this.renderer.removeClass(this.body.nativeElement, 'sticky');
    this.tiendaSeleccionada = undefined;
  }
}
