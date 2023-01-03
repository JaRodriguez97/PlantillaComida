import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterModule } from '@components/Footer/footer.module';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoComponent } from './pedido.component';

@NgModule({
  declarations: [PedidoComponent],
  imports: [CommonModule, FooterModule, PedidoRoutingModule],
})
export class PedidoModule {}
