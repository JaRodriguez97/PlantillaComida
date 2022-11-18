import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { comboInterface } from '@models/combo.interface';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnInit {
  @Input() comentarios!: [{ _id: String; texto: String }];
  contactForm!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.initForm();
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      name: ['' /*[Validators.required,Validators.minlength(3)]*/],
      email: ['' /*[Validators.required,Validators.minlength(3)]*/],
      rol: ['' /*[Validators.required,Validators.minlength(3)]*/],
      comentario: ['' /*[Validators.required,Validators.minlength(3)]*/],
    });
  }

  handleSubmit() {
    const myForm = '';
    // const formData = new FormData(myForm);

    // fetch('/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams(formData).toString(),
    // })
    //   .then(() => console.log('Form successfully submitted'))
    //   .catch((error) => alert(error));
  }
}
