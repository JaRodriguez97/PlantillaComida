import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
})
export class PedidoComponent implements OnInit {
  constructor(public appComponent: AppComponent, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(
      this.appComponent.pedidoSection.nativeElement,
      'finalizarPedido'
    );
  }
}
