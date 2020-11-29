import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit , OnDestroy{
  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSus: Subscription;
  public desde = 0;
  public cargando = true;
  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService
    ) { }
  ngOnDestroy(): void {
    this.imgSus.unsubscribe();
  }

  ngOnInit(): void {
   this.cargarUsuarios();
   this.imgSus = this.modalImagenService
   .nuevaImagen.pipe(delay(100))
   .subscribe(img => this.cargarUsuarios());
  }
  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    } );
  }

  cargarPagina(valor: number){
    this.desde += valor;
    if (this.desde < 0){
      this.desde = 0;
    }else if (this.desde + valor > this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino){
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termino)
    .subscribe((resultados: any) =>
      this.usuarios = resultados);
  }

  eliminarUsuario(usuario: Usuario){
     if (usuario.uid === this.usuarioService.uid) {
       return Swal.fire('Error', 'No puede borrarse asi mismo', 'error');
     }
     Swal.fire({
        title: '¿Borrar usuario?',
        text: `Esta apunto de borrar a ${usuario.nombre}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si , Borrarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.eliminarUsuario(usuario)
          .subscribe((resp) => {
                this.cargarUsuarios();
                Swal.fire(
                'Usuario Borrado',
                `${usuario.nombre} fue eliminado correctamente`,
                'success'
                );
          });
        }
      });
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
    .subscribe(resp => {
        console.log(resp);
    });
  }


  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal(
      'usuarios', usuario.uid, usuario.img
    );

  }

}
