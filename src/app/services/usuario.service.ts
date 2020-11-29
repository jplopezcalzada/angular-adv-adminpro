import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interfaces';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { LoginForm } from '../interfaces/login-form.interfaces';

import { Usuario } from '../models/usuario.model';

import { environment } from '../../environments/environment.prod';



const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {

    this.googleInit();
  }
  get token(): string{
    return localStorage.getItem('token') || '';
  }
  get uid(): string{
    return this.usuario.uid || '';
  }
  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    };
  }
  googleInit(){

    return new Promise (resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '3532711978-q27jlr0coj2uq80o76gu8e581or10pod.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });

  }
  logout(){
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
        });
      });

  }
  validarToken(): Observable<boolean>{

    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map( (resp: any) => {
      //console.log(resp);
      const { email, google, img = '', nombre, role, uid } = resp.usuario;
      this.usuario = new Usuario ( nombre, email, '', img, google, role, uid);
      localStorage.setItem('token', resp.token);
      return true;
      }),
      catchError( (error) => of(false))
      );
  }
  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
    .pipe(tap( (resp: any) => {
      localStorage.setItem('token', resp.token);
      console.log(resp);
    }

    ));
  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}){
    data = {
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);

  }
  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(tap( (resp: any) => {
      localStorage.setItem('token', resp.token);
     // console.log(resp);
    }

    ));
  }

  loginGoogle(token){
    return this.http.post(`${base_url}/login/google`, {token})
    .pipe(tap( (resp: any) => {
      localStorage.setItem('token', resp.token);
      //console.log(resp);
    }

    ));
  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${desde}`;

    return this.http.get<CargarUsuario>(url, this.headers)
            .pipe(
              map( resp => {
                const usuarios = resp.usuarios
                  .map(user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid ));
                return {total: resp.total , usuarios};
              })
              );

  }
  eliminarUsuario(usuario: Usuario){

    const url = `${base_url}/usuarios/${usuario.uid}`;

    return this.http.delete(url, this.headers);
  }


  guardarUsuario(usuario: Usuario){
    console.log(usuario);
    console.log(`${base_url}/usuarios/${usuario.uid}`);
    
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);

  }
}
