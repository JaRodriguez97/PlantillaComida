export interface comboInterface {
  _id: String;
  precio: number;
  peso: String;
  ingredientes: String;
  incluye: String;
  img: String;
  existentes: Number;
  REF: String;
  estrellas: Number;
  nombre: String;
  comentarios: [{ _id: String; texto: String }];
}
