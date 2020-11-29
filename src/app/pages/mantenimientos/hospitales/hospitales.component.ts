import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];


  public cargando = true;
  private imgSus: Subscription;
  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSus.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSus = this.modalImagenService
    .nuevaImagen.pipe(delay(100))
    .subscribe(img => this.cargarHospitales());
  }
  buscar(termino){
    if (termino.length === 0) {
      return this.hospitales = this.hospitalesTemp;
    }
    this.busquedasService.buscar('hospitales', termino)
    .subscribe((resp: Hospital[]) =>
      this.hospitales = resp);
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      });
  }
  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
    .subscribe(resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    });
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.borrarHospital(hospital._id)
    .subscribe(resp => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success');
    });
  }

  async abrirSweetAlert (){

    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true
    });
    if (value.trim().length > 0 ) {
      this.hospitalService.crearHospital(value)
      .subscribe((resp: any) => {
        this.hospitales.push(resp.hospital);
      });
    };
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal(
      'hospitales', hospital._id, hospital.img
    );

  }

}
