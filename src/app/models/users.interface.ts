import { LowerCasePipe } from '@angular/common';
import { pedidoInterface } from './pedido.interface';

export interface userInterface {
  _id?: String;
  apellidos?: String;
  contraseña?: String;
  email?: String | LowerCasePipe;
  direccion?: String;
  img?: String;
  nombres?: String;
  numeroTelefono?: Number;
  userName?: String;
  pedido?: pedidoInterface[];
  pedidosRealizados?: [{ pedido: pedidoInterface[]; fecha: Date }];
  favoritos?: String[];
}
