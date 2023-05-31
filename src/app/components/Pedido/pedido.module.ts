import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterModule } from '@components/Footer/footer.module';
import { FormsModule } from '@angular/forms';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoComponent } from './pedido.component';

@NgModule({
  declarations: [PedidoComponent],
  imports: [CommonModule, FooterModule, PedidoRoutingModule, FormsModule],
})
export class PedidoModule {}
