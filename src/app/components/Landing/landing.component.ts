import { Component, OnInit } from '@angular/core';
import { userInterface } from '@models/users.interface';
import { AppComponent } from '@app/app.component';
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
    private appComponent: AppComponent,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner
      .show()
      .then(() => {
        this.appComponent.user = this.localStorageService.get('user', {})!;
      })
      .then(() => {
        this.spinner.hide();
      });
  }
}
