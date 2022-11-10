import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  _id!: String;

  constructor(
    private combosService: CombosService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show().then(() => {
      let params = this.activatedRoute.snapshot.params;
      this._id = params['id'];

      this.combosService.getCombo(this._id).subscribe(
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
        () => this.spinner.hide()
      );
    });
  }
}
