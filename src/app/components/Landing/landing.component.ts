import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { userInterface } from '@models/users.interface';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  user!: userInterface;

  constructor(
    private localStorageService: LocalStorageService,
    private appComponent: AppComponent,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner
      .show()
      .then(() => {
        this.appComponent.addActivePedido();
        this.appComponent.ngOnInit();
      })
      .then(() => setTimeout(() => this.spinner.hide(), 500));
  }

  realizarPedido() {
    this.spinner.show().then(() => {
      if (!this.localStorageService.get('userID', {}))
        this.router.navigate(['/login']);
      else this.router.navigate(['/menu']);
    });
  }
}
