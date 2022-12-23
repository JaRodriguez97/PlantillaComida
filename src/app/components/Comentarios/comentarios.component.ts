import { LowerCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { ComboComponent } from '@components/Combo/combo.component';
import { ComentarioInterface } from '@models/comentarios.interface';
import { userInterface } from '@models/users.interface';
import { CombosService } from '@service/Combos/combos.service';
import { UsersService } from '@service/Users/users.service';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnInit {
  @Input() comentarios!: ComentarioInterface[];
  @Input() comentarioID!: String;
  contactForm!: FormGroup;
  user!: userInterface;
  userArray: userInterface[] = [];
  usersComentarios!: userInterface;

  constructor(
    private readonly formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private usersService: UsersService,
    private combosService: CombosService,
    private spinner: NgxSpinnerService,
    private comboComponent: ComboComponent,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    if (this.comentarios && this.comentarios.length)
      this.comentarios.forEach((comentario) => {
        if (comentario._idUser)
          this.usersService.getUser(comentario._idUser).subscribe(
            (res) => this.userArray.push(res),
            (err) => console.error(err)
          );
        else {
          this.userArray.push({
            nombres: comentario.nombres,
            apellidos: comentario.apellidos,
          });
        }
      });

    let userID = this.localStorageService.get<String>('userID', {})!,
      groupForm: {
        id?: (String | ValidationErrors | null)[];
        nombres: (String | ValidationErrors | null)[];
        email: (String | LowerCasePipe | ValidationErrors | null)[];
        apellidos: (String | ValidationErrors | null)[];
        comentarios: (String | ValidationErrors | null)[];
        celular: (Number | ValidationErrors | null)[];
      } = {
        nombres: [],
        email: [],
        apellidos: [],
        comentarios: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(3000),
          ],
        ],
        celular: [],
      };

    if (userID) {
      this.usersService.getUser(userID).subscribe(
        (res) => {
          this.user = res;
          groupForm.id = [];
          groupForm.id.push(userID);
          if (res.nombres)
            groupForm.nombres.push(res.nombres, [
              Validators.required,
              Validators.minLength(3),
            ]);
          if (res.apellidos)
            groupForm.apellidos.push(res.apellidos, [
              Validators.required,
              Validators.minLength(3),
            ]);
          if (res.numeroTelefono)
            groupForm.celular.push(res.numeroTelefono, [
              Validators.required,
              Validators.minLength(10),
            ]);
          if (res.email)
            groupForm.email.push(res.email, [
              Validators.required,
              Validators.minLength(5),
            ]);
        },
        (err) => console.error(err),
        () => (this.contactForm = this.initForm(groupForm))
      );
    }

    this.contactForm = this.initForm();
  }

  initForm(groupForm?: {
    nombres: (String | ValidationErrors | null)[];
    email: (String | LowerCasePipe | ValidationErrors | null)[];
    apellidos: (String | ValidationErrors | null)[];
    comentarios: (String | ValidationErrors | null)[];
    celular: (Number | ValidationErrors | null)[];
  }): FormGroup {
    if (groupForm && groupForm.nombres && groupForm.nombres.length)
      return this.formBuilder.group(groupForm);

    return this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.minLength(3),]],
      email: ['', [Validators.required, Validators.minLength(5)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      comentarios: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(3000),
        ],
      ],
      celular: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  handleSubmit(comentarioID: String) {
    this.spinner.show().then(() => {
      console.log(this.contactForm.value);
      this.combosService
        .updateComboComentario(comentarioID, this.contactForm.value)
        .subscribe(
          (res) => console.log(res),
          (err) => console.error(err),
          () => this.appComponent.reloadTo('/combo/' + this.comentarioID)
        );
    });
  }

  getUserComent() {}
}
