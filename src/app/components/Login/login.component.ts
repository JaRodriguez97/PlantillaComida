import { AppComponent } from '@app/app.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { userInterface } from '@app/models/users.interface';
import { UsersService } from '@service/Users/users.service';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('signInBtn') signInBtn!: ElementRef;
  @ViewChild('signUpBtn') signUpBtn!: ElementRef;
  @ViewChild('formBx') formBx!: ElementRef;
  @ViewChild('body') body!: ElementRef;
  telefono!: Number;
  contrasena!: String;
  repiteContrasena!: String;
  nombres!: String;
  apellidos!: String;
  email!: String;
  idCombo!: String;

  constructor(
    private appComponent: AppComponent,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
  }

  ngAfterViewInit(): void {
    if (this.localStorageService.get<String>('userID', {}))
      this.router.navigate(['/landing']);

    this.renderer.listen(this.signUpBtn.nativeElement, 'click', () => {
      this.renderer.addClass(this.formBx.nativeElement, 'active');
      this.renderer.addClass(this.body.nativeElement, 'active');
    });

    this.renderer.listen(this.signInBtn.nativeElement, 'click', () => {
      this.renderer.removeClass(this.formBx.nativeElement, 'active');
      this.renderer.removeClass(this.body.nativeElement, 'active');
    });
    this.spinner.hide();
  }

  checkLogin() {
    this.spinner
      .show()
      .then(() => {
        if (!this.telefono) throw new Error('Diligenciar campo telefono');
        else if (!this.contrasena)
          throw new Error('Diligenciar campo contraseña');

        let form = {
          numeroTelefono: this.telefono,
          contraseña: this.contrasena,
        };

        this.usersService.getLogin(form).subscribe(
          (res) => {
            let { id } = this.activatedRoute?.snapshot?.params || undefined;

            this.appComponent.user = res;
            this.localStorageService.set<String>('userID', res._id!, {});

            if (id && !res.pedido?.length)
              this.usersService
                .updateUser(res._id!, [{ _id: id, cantidad: 1 }], 'pedido')
                .subscribe((res) =>
                  console.log('🚀 ~ line:89 ~ LoginComponent ~ User', res)
                );
            else if (id && res.pedido?.length) {
            }

            this.router.navigate(['/menu']);
            // peticion post a base de datos para almacenar
            // this.localStorageService.set('pedido', { [id]: 1 }, {});
          },
          (err) =>
            this.spinner.hide().then(() => {
              console.error(err);
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error.message,
              });
            })
        );
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error(err);
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err,
          });
        })
      );
  }

  checkSignUp() {
    this.spinner
      .show()
      .then(() => {
        if (!this.telefono) throw new Error('Diligenciar campo telefono');
        else if (!this.contrasena)
          throw new Error('Diligenciar campo contraseña');
        else if (!this.repiteContrasena)
          throw new Error('Diligenciar nuevamente la contraseña');
        else if (this.repiteContrasena !== this.contrasena)
          throw new Error('Las contraseñas no coinciden');

        let form = {
          numeroTelefono: this.telefono,
          contraseña: this.contrasena,
          nombres: this.nombres,
          apellidos: this.apellidos,
          email: this.email,
        };

        this.usersService.getSignUp(form).subscribe(
          (res) => {
            Swal.fire({
              icon: 'success',
              imageWidth: 100,
              confirmButtonColor: '#000',
              html: `<b>Te damos la bienvenida ${
                res.nombres || res.numeroTelefono
              }</b>`,
            }).then(() => {
              this.spinner.show().then(() => {
                // this.localStorageService.set<String>('userID', res._id!, {});
                this.renderer.removeClass(this.formBx.nativeElement, 'active');
                this.renderer.removeClass(this.body.nativeElement, 'active');
                setTimeout(() => this.spinner.hide(), 500);
              });
            });
          },
          (err) =>
            this.spinner.hide().then(() => {
              console.error(err);
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error.message,
              });
            }),
          () => this.spinner.hide()
        );
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error(err);
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err.error.message,
          });
        })
      );
  }
}
