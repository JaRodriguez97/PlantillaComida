import { Component, OnInit } from '@angular/core';
import { userInterface } from '@models/users.interface';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  user!: userInterface;

  constructor(private appComponent: AppComponent) {}

  ngOnInit(): void {
    this.appComponent.user = JSON.parse(
      globalThis.localStorage.getItem('user')!
    );
  }
}
