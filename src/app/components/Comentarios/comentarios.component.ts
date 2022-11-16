import { Component, Input, OnInit } from '@angular/core';
import { comboInterface } from '@models/combo.interface';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnInit {
  @Input() comentarios!: [{ _id: String; texto: String }];
  
  constructor() {}

  ngOnInit(): void {
    console.log(
      '🚀 ~ file: comentarios.component.ts ~ line 14 ~ ComentariosComponent ~ ngOnInit ~ comentarios',
      this.comentarios
    );
  }
}
