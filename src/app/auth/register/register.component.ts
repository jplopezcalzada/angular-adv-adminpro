import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'
  ]
})
export class RegisterComponent {
  public formSubmit = false;
  public registerForm = this.fb.group({
    nombre: ['Juan Pedro', [Validators.required, Validators.minLength(3)]],
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required] ],
    password2: ['123456', [Validators.required] ],
    terminos: [true, Validators.required]

  }, {validators: this.passwordsIguales('password', 'password2')});

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) { }

  crearUsuario(){
    this.formSubmit = true;
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
        return ;
    }
    // Realizar posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
    .subscribe((resp) => {
        // Navergar al dashboard
        this.router.navigateByUrl('/');
    }, (err) => {
      // Si sucede el error
        Swal.fire('Error', err.error.msg,'error');
    });
  }
  campoNoValido(campo: string): boolean{
    if (this.registerForm.get(campo).invalid && this.formSubmit){
      return true;
    } else{
      return false;
    }
  }
  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmit;
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;
    if ((pass1 !== pass2) && this.formSubmit) {
      return true;
    } else {
      return false;
    }
  }
  passwordsIguales(pass1Name: string, pass2Name: string){
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);
      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
       pass2Control.setErrors({noEsIgual: true});
      }
    };
  }


}
