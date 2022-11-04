import { LowerCasePipe } from '@angular/common';

export interface userInterface {
  apellidos?: String;
  contraseña: String;
  email?: String | LowerCasePipe;
  direccion?: String;
  img?: String;
  nombres?: String;
  numeroTelefono: Number;
  userName?: String;
}
