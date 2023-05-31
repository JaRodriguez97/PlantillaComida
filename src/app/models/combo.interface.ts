import { ComentarioInterface } from './comentarios.interface';

export interface comboInterface {
  _id: string;
  precio: number;
  peso: string;
  ingredientes: string;
  incluye: string;
  img: string;
  existentes: number;
  REF: string;
  estrellas: number;
  nombre: string;
  comentarios: ComentarioInterface[];
}
