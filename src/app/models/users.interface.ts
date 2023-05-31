import { LowerCasePipe } from '@angular/common';
import { pedidoInterface } from './pedido.interface';

export interface userInterface {
  _id?: string;
  apellidos?: string;
  contraseña?: string;
  email?: string | LowerCasePipe;
  direccion?: string;
  img?: string;
  nombres?: string;
  numeroTelefono?: number;
  userName?: string;
  pedido?: pedidoInterface[];
  pedidosRealizados?: [{ pedido: pedidoInterface[]; fecha: Date }];
  favoritos?: string[];
}
