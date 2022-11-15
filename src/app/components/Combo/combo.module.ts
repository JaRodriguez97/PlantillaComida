import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterModule } from '@components/Footer/footer.module';

import { ComboRoutingModule } from './combo-routing.module';
import { ComboComponent } from './combo.component';
import { ComentariosModule } from '@components/Comentarios/comentarios.module';

@NgModule({
  declarations: [ComboComponent],
  imports: [CommonModule, ComboRoutingModule, FooterModule, ComentariosModule],
})
export class ComboModule {}
