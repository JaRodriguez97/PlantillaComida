import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner.show().then(() => setTimeout(() => this.spinner.hide(), 1000));
  }

  realizarPedido() {
    this.spinner.show().then(() => {
      if (!this.localStorageService.get('user', {}))
        this.router.navigate(['/login']);
      else this.router.navigate(['/menu']);
    });
  }
}
