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
    private router: Router
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
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/landing']);
      },
      (err) => console.error(err),
      () => {}
    );
  }
}
