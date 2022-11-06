import { Component, OnInit } from '@angular/core';
import { userInterface } from '@models/users.interface';
import { AppComponent } from '@app/app.component';
import { LocalStorageService } from 'ngx-localstorage';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  user!: userInterface;

  constructor(
    private appComponent: AppComponent,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.appComponent.user = this.localStorageService.get('user', {})!;
  }
}
