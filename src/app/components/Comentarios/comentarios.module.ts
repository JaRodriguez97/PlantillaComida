import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComentariosComponent } from './comentarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ComentariosComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ComentariosComponent],
})
export class ComentariosModule {}
