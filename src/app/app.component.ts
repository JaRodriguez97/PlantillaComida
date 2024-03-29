import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { comboInterface } from '@models/combo.interface';
import { pedidoInterface } from '@models/pedido.interface';
import { userInterface } from '@models/users.interface';
import { CombosService } from '@service/Combos/combos.service';
import { UsersService } from '@service/Users/users.service';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import { getWindow } from 'ssr-window';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PlantillaComida';
  pedidos!: pedidoInterface[];
  totalPedido!: number;
  pedidosLength!: number;
  user!: userInterface | undefined;
  userID!: string | null | undefined;
  sectionContentPedido!: Boolean;
  finalizarPedido!: Boolean;
  combosPedido!: comboInterface[];
  faHeart = faHeart;

  @ViewChild('header') header!: ElementRef;
  @ViewChild('toggle') menuToggle!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @ViewChild('pedido') pedidoSection!: ElementRef;
  @ViewChild('screenEvent') screenEvent!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private combosService: CombosService,
    public router: Router,
    public localStorageService: LocalStorageService,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    if (window.scrollY > 0)
      return this.renderer.addClass(this.header.nativeElement, 'sticky');

    this.renderer.removeClass(this.header.nativeElement, 'sticky');
  }

  async ngOnInit(): Promise<void> {
    let pedidoStorage = this.localStorageService.get<pedidoInterface[]>(
      'pedido',
      {}
    );

    this.finalizarPedido = false;
    this.totalPedido = 0;
    this.pedidosLength = 1;
    this.userID = this.localStorageService.get<string>('userID', {});

    if (this.userID) this.getUser(this.userID);
    else if (pedidoStorage && pedidoStorage.length) {
      this.pedidosLength = pedidoStorage.length;
      this.pedidos = pedidoStorage;

      this.getTotalPedido(this.pedidos.map((pedido) => pedido._id));
    } else this.spinner.hide();
  }

  getUser(ID: string) {
    this.usersService.getUser(ID).subscribe(
      (res) => {
        this.user = res;
        this.pedidos = this.user.pedido!;
        this.pedidosLength = this.pedidos.length;
      },
      (err) =>
        this.spinner.hide().then(() => {
          console.error(err);
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err.error.message,
            scrollbarPadding: false,
          });
        }),
      () => this.getTotalPedido(this.pedidos.map((pedido) => pedido._id)!)
    );
  }

  getTotalPedido(arrayPedidos: Array<string>) {
    this.combosService.getTotalPedido(arrayPedidos).subscribe(
      (res) => {
        this.combosPedido = res;
        this.totalPedido = res.reduce((accumulator, currentValue) => {
          let pedidoReduce: pedidoInterface[] = [];

          if (this.user) pedidoReduce = this.user.pedido!;
          else if (this.pedidos) pedidoReduce = this.pedidos;

          let positionCombo = pedidoReduce.findIndex(
            (combo) => combo._id == currentValue._id
          );

          currentValue.precio =
            pedidoReduce[positionCombo].cantidad! * currentValue.precio;

          return accumulator + currentValue.precio;
        }, 0);
      },
      (err) =>
        this.spinner.hide().then(() => {
          console.error(err);
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err.error.message,
            scrollbarPadding: false,
          });
        }),
      () => {
        if (getWindow().location.pathname !== '/finalizarPedido')
          this.renderer.removeClass(
            this.pedidoSection.nativeElement,
            'finalizarPedido'
          );

        this.sectionContentPedido ? this.spinner.hide() : null;
      }
    );
  }

  onActivate(event: Event) {
    if (getWindow().scroll)
      getWindow().scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
  }

  async reloadTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  toogleMenu() {
    let toggleMenu = this.menuToggle.nativeElement,
      menu = this.menu.nativeElement,
      existe = [toggleMenu.classList].filter(
        (classN) => classN.value.indexOf('active') !== -1
      );

    if (existe.length) {
      this.renderer.removeClass(toggleMenu, 'active');
      this.renderer.removeClass(menu, 'active');
    } else {
      this.renderer.addClass(toggleMenu, 'active');
      this.renderer.addClass(menu, 'active');
    }
  }

  redirectTo(str: string) {
    this.renderer.removeClass(this.menuToggle.nativeElement, 'active');
    this.renderer.removeClass(this.menu.nativeElement, 'active');
    this.router.navigate([str]);
  }

  logOut() {
    Swal.fire({
      icon: 'success',
      imageWidth: 100,
      confirmButtonColor: '#000',
      confirmButtonAriaLabel: '',
      html: '<b>Sesión Cerrada Exitosamente</b>',
      scrollbarPadding: false,
    })
      .then(() => this.redirectTo('/login'))
      .then(() => ((this.user = undefined), (this.pedidos = [])))
      .then(() => this.localStorageService.clear());
  }

  activePedido(): Boolean {
    let pedi = this.localStorageService.get<pedidoInterface[]>('pedido', {});

    if (this.user && this.user.pedido && this.user.pedido.length) return true;
    if (pedi && pedi.length) return true;

    return false;
  }

  addActivePedido() {
    if (this.activePedido())
      this.renderer.addClass(this.pedidoSection.nativeElement, 'active');
  }

  screenPedido(): void {
    // let classList = this.pedidoSection.nativeElement.classList;
    if (!this.pedidoSection.nativeElement.classList.contains('screen')) {
      this.renderer.addClass(this.pedidoSection.nativeElement, 'screen');
      this.renderer.addClass(this.screenEvent.nativeElement, 'active');
      this.sectionContentPedido = true;

      if (
        this.pedidoSection.nativeElement.classList.contains('finalizarPedido')
      )
        return;
    } else {
      this.renderer.removeClass(this.pedidoSection.nativeElement, 'screen');
      this.renderer.removeClass(this.screenEvent.nativeElement, 'active');
      this.sectionContentPedido = false;
      console.log(
        "🚀 ~ file: app.component.ts:241 ~ AppComponent ~ classList.contains('finalizarPedido')",
        this.pedidoSection.nativeElement.classList.contains('finalizarPedido')
      );
      if (
        this.pedidoSection.nativeElement.classList.contains('finalizarPedido')
      ) {
        this.finalizarPedido = false;
      } else this.reloadTo('/menu');
    }
    this.ngOnInit();
  }

  terminarPedido() {
    this.router.navigate(['/finalizarPedido']).then(() => {
      this.renderer.removeClass(this.pedidoSection.nativeElement, 'screen');
      this.renderer.removeClass(this.screenEvent.nativeElement, 'active');

      this.sectionContentPedido = false;
      this.finalizarPedido = true;
    });
  }

  getCantidadCombos(_id: string) {
    return this.pedidos?.filter((pedido) => pedido._id === _id)[0]?.cantidad;
  }

  async restCar(_id: string, realoadTo?: string) {
    this.spinner
      .show()
      .then(() => {
        this.pedidos = this.pedidos.filter((pedido) => {
          if (pedido.cantidad)
            if (pedido._id === _id && pedido.cantidad > 1) pedido.cantidad--;
            else if (pedido._id === _id && pedido.cantidad == 1) return false;

          return pedido;
        });
      })
      .then(() => {
        if (!this.pedidos.length) {
          this.sectionContentPedido = false;
          this.renderer.removeClass(this.pedidoSection.nativeElement, 'screen');
          this.renderer.removeClass(this.screenEvent.nativeElement, 'active');
          this.reloadTo(realoadTo! || '/menu');
        }

        if (this.userID)
          this.usersService
            .updateUser(this.userID, this.pedidos, 'pedido')
            .subscribe(
              (res) =>
                console.log(
                  '🚀 ~ file: app.component.ts:258 ~ AppComponent ~ .then ~ res',
                  res
                ),
              (err) =>
                this.spinner.hide().then(() => {
                  console.error(err);
                  Swal.fire({
                    confirmButtonColor: '#000',
                    icon: 'error',
                    html: err.error.message,
                    scrollbarPadding: false,
                  });
                }),
              () => this.ngOnInit()
            );
        else {
          this.localStorageService.set('pedido', this.pedidos, {});
          this.ngOnInit();
        }
      });
  }

  async addCarCantidad(_id: string) {
    this.spinner
      .show()
      .then(() => {
        this.pedidos = this.pedidos.map((pedido) => {
          if (pedido.cantidad && pedido._id === _id) pedido.cantidad++;

          return pedido;
        });
      })
      .then(() => {
        if (this.userID)
          this.usersService
            .updateUser(this.userID, this.pedidos, 'pedido')
            .subscribe(
              (res) => {
                console.log(
                  '🚀 ~ file: app.component.ts:262 ~ AppComponent ~ .then ~ res',
                  res
                );
              },
              (err) =>
                this.spinner.hide().then(() => {
                  console.error(err);
                  Swal.fire({
                    confirmButtonColor: '#000',
                    icon: 'error',
                    html: err.error.message,
                    scrollbarPadding: false,
                  });
                }),
              () => this.ngOnInit()
            );
        else {
          this.localStorageService.set('pedido', this.pedidos, {});
          this.ngOnInit();
        }
      });
  }

  validateFavorite(_id: string): Boolean {
    if (this.user && this.user.favoritos && this.user.favoritos.length)
      if (this.user.favoritos.indexOf(_id) !== -1) return true;

    return false;
  }

  addFavorite(_id: string) {
    this.spinner.show().then(() => {
      if (this.user) {
        if (this.user.favoritos) {
          if (this.user.favoritos.length) {
            let index = this.user.favoritos.indexOf(_id);

            if (index == -1) this.user.favoritos.push(_id);
            else this.user.favoritos!.splice(index, 1);
          } else this.user.favoritos.push(_id);
        } else {
          this.user.favoritos = [];
          this.user.favoritos.push(_id);
        }

        this.usersService
          .updateUser(this.user._id, this.user.favoritos, 'favoritos')
          .subscribe(
            (res) => this.ngOnInit(),
            (err) =>
              this.spinner.hide().then(() => {
                console.error(err);
                Swal.fire({
                  confirmButtonColor: '#000',
                  icon: 'error',
                  html: err.error.message,
                  scrollbarPadding: false,
                });
              })
          );
      } else {
        this.spinner.hide();
        Swal.fire({
          icon: 'question',
          title: 'NO HAS INICIADO SESIÓN',
          text: 'Registrate antes para poder marcar como favorito',
          showCancelButton: true,
          scrollbarPadding: false,
        }).then((response) => {
          if (response.value) this.router.navigate(['/login']);
        });
      }
    });
  }

  existeComboPedido(_id: string, pedidos: pedidoInterface[]): Boolean {
    return !pedidos?.some((pedido) => pedido._id === _id) || false;
  }

  async addToCar(_id: string, i?: number, realoadTo?: string): Promise<void> {
    this.spinner.show().then(() => {
      if (typeof i == 'number') {
        let list = this.document.querySelectorAll('.action')[i];

        this.renderer.addClass(list, 'active');
      }

      if (!this.user) {
        if (!this.pedidos) {
          this.spinner.hide().then(() => {
            Swal.fire({
              icon: 'question',
              title: 'NO ESTÁ REGISTRADO',
              html: `<h4>Desea ingresar antes de hacer su pedido?</h4>
        <h6 style="font-size:10px">Si marca NO podrá hacer su pedido sin
        ningún problema, pero de manera anónima.</h6>`,
              showCancelButton: true,
              cancelButtonText: 'Quiero hacer mi pedido ya',
              confirmButtonText: 'Deseo ingresar a mi cuenta',
              scrollbarPadding: false,
            }).then((response) => {
              if (response.isConfirmed) this.router.navigate(['/login', _id]);
              else {
                this.pedidos = [];
                this.pedidos.push({ _id, cantidad: 1 });
                this.localStorageService.set('pedido', this.pedidos, {});
                this.ngOnInit();
                this.reloadTo(realoadTo! || '/menu');
              }
            });
          });
        } else {
          this.pedidos.push({ _id, cantidad: 1 });
          this.localStorageService.set('pedido', this.pedidos, {});
          this.ngOnInit();
        }
      } else {
        this.pedidos.push({ _id, cantidad: 1 });

        this.usersService
          .updateUser(this.userID, this.pedidos, 'pedido')
          .subscribe(
            (res) => {
              console.log(
                '🚀 ~ file: app.component.ts:430 ~ this.usersService.updateUser ~ res',
                res
              );
            },
            (err) =>
              this.spinner.hide().then(() => {
                console.error(err);
                Swal.fire({
                  confirmButtonColor: '#000',
                  icon: 'error',
                  html: err.error.message,
                  scrollbarPadding: false,
                });
              }),
            () => this.ngOnInit()
          );
      }
    });
  }
}
