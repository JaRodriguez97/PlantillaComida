import { comboInterface } from '@models/combo.interface';
import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { CombosService } from '@service/Combos/combos.service';
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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let params = this.activatedRoute.snapshot.params;
    this._id = params['id'];

    this.combosService.getCombo(this._id).subscribe(
      (res) => (this.combo = res),
      (err) => console.error(err)
    );
  }
}
