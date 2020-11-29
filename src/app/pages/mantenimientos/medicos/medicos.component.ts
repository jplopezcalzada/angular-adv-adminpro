import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];

  private imgSus: Subscription;
  public cargando = true;
  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSus.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSus = this.modalImagenService
    .nuevaImagen.pipe(delay(100))
    .subscribe(img => this.cargarMedicos());
  }
  buscar(termino){
    if (termino.length === 0) {
      return this.medicos = this.medicosTemp;
    }
    this.busquedasService.buscar('medicos', termino)
    .subscribe((resp: Medico[]) =>
      this.medicos = resp);
  }
  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
      });
  }
  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal(
      'medicos', medico._id, medico.img
    );

  }
  guardarCambios(medico: Medico){
    this.medicoService.actualizarMedico(medico)
    .subscribe(resp => {
      Swal.fire('Actualizado', medico.nombre, 'success');
    });
  }

  eliminarMedico(medico: Medico){
    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta apunto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si , Borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id)
        .subscribe((resp) => {
              this.cargarMedicos();
              Swal.fire(
              'Medico Borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
              );
        });
      }
    });
  }
}
