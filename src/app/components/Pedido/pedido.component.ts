import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
})
export class PedidoComponent implements OnInit {
  nombreCompleto!: string;
  telefono!: number;
  direccionExacta!: string;
  detallesDireccion!: string;

  constructor(
    public appComponent: AppComponent,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(
      this.appComponent.pedidoSection.nativeElement,
      'finalizarPedido'
    );
  }

  SendOrder() {
    this.spinner
      .show()
      .then(() => {
        if (!this.nombreCompleto)
          throw new Error('Diligenciar campo Nombre Completo');
        else if (!this.telefono)
          throw new Error('Diligenciar campo Número de WhatsApp');
        else if (!this.direccionExacta)
          throw new Error('Diligenciar campo Dirección Exacta');
        else if (!this.detallesDireccion)
          throw new Error('Diligenciar campo Datos Extras Dirección');

        let form = {
          nombreCompleto: this.nombreCompleto,
          numeroTelefono: this.telefono,
          direccionExacta: this.direccionExacta,
          detallesDireccion: this.detallesDireccion,
        };

        //Finalizar petición http

        console.log(
          '🚀 ~ file: pedido.component.ts:38 ~ PedidoComponent ~ this.spinner.show ~ form:',
          form
        );
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error({ err });
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err.error?.message || err.message,
          });
        })
      );
  }
}
