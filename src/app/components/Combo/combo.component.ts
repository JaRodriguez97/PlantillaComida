import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { comboInterface } from '@models/combo.interface';
import { CombosService } from '@service/Combos/combos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css'],
})
export class ComboComponent implements OnInit {
  combo!: comboInterface;

  constructor(
    public appComponent: AppComponent,
    private combosService: CombosService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner.show().then(() => {
      let { id } = this.activatedRoute.snapshot.params;

      this.combosService.getCombo(id).subscribe(
        (res) => (this.combo = res),
        (err) =>
          this.spinner.hide().then(() => {
            console.error(err);
            Swal.fire({
              confirmButtonColor: '#000',
              icon: 'error',
              html: err.error.message,
            });
          }),
        () => setTimeout(() => this.spinner.hide(), 500)
      );
    });
  }

  addToCar(_id: String, i?: number, realoadTo?: String) {
    this.appComponent.addToCar(_id, i, realoadTo).then(() => this.ngOnInit());
  }

  restCar(_id: String, realoadTo?: String) {
    this.appComponent.restCar(_id, realoadTo).then(() => this.ngOnInit());
  }

  addCarCantidad(_id: String) {
    this.appComponent.addCarCantidad(_id).then(() => this.ngOnInit());
  }
}
