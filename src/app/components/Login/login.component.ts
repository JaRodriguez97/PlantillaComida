import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('signInBtn') signInBtn!: ElementRef;
  @ViewChild('signUpBtn') signUpBtn!: ElementRef;
  @ViewChild('formBx') formBx!: ElementRef;
  @ViewChild('body') body!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderer.listen(this.signUpBtn.nativeElement, 'click', () => {
      this.renderer.addClass(this.formBx.nativeElement, 'active');
      this.renderer.addClass(this.body.nativeElement, 'active');
    });

    this.renderer.listen(this.signInBtn.nativeElement, 'click', () => {
      this.renderer.removeClass(this.formBx.nativeElement, 'active');
      this.renderer.removeClass(this.body.nativeElement, 'active');
    });
  }
}
