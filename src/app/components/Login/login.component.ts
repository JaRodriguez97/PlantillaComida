import { Router } from '@angular/router';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UsersService } from '@service/Users/users.service';
import Swal from 'sweetalert2';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { LocalStorageService } from 'ngx-localstorage';
import { userInterface } from '@app/models/users.interface';

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

  constructor(
    private renderer: Renderer2,
    private usersService: UsersService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderer.listen(this.signUpBtn.nativeElement, 'click', () => {
      this.renderer.addClass(this.formBx.nativeElement, 'active');
      this.renderer.addClass(this.body.nativeElement, 'active');
    });

    this.renderer.listen(this.signInBtn.nativeElement, 'click', () => {
      this.renderer.removeClass(this.formBx.nativeElement, 'active');
      this.renderer.removeClass(this.body.nativeElement, 'active');
    });
  }

  checkLogin() {
    if (!this.telefono) return alert('diligenciar campo telefono');
    else if (!this.contrasena) return alert('diligenciar campo contraseña');
    let form = {
      numeroTelefono: this.telefono,
      contraseña: this.contrasena,
    };

    this.usersService.getLogin(form).subscribe(
      (res) => {
        this.localStorageService.set<userInterface>('user', res, {});
        this.router.navigate(['/landing']);
      },
      (err) => console.error(err),
      () => {}
    );
  }

  checkSignUp() {
    if (!this.telefono) return alert('Diligenciar campo telefono');
    else if (!this.contrasena) return alert('Diligenciar campo contraseña');
    else if (!this.repiteContrasena)
      return alert('Diligenciar nuevamente la contraseña');
    else if (this.repiteContrasena !== this.contrasena)
      return alert('Las contraseñas no coinciden');

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
          // imageUrl: 'assets/images/Icono Mercury.png',
          icon: 'success',
          imageWidth: 100,
          confirmButtonColor: '#007bff',
          html: '<b>Se ha creado la cuenta correctamente, por favor, inicia sesión</b>',
        }).then(() => {
          this.renderer.removeClass(this.formBx.nativeElement, 'active');
          this.renderer.removeClass(this.body.nativeElement, 'active');
        });
      },
      (err) => {
        console.error(err);

        Swal.fire({
          // imageUrl: 'assets/images/Icono Mercury.png',
          icon: 'error',
          imageWidth: 100,
          confirmButtonColor: '#007bff',
          html: `<b>${err.message}</b>`,
        });
      },
      () => {}
    );
  }
}
