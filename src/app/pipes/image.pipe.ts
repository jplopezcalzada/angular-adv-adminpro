import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
const base_url = environment.base_url;
@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios'|'medicos'|'hospitales'): string {
   // return 'hola mundo ' + img + ' ' + tipo;

      if (!img){
          return `${base_url}/uploads/usuarios/no-image`;
      }else if (img.includes('https')) {
          return img;
      }else if (img) {
          return `${base_url}/uploads/${tipo}/${img}`;
      } else {
          return `${base_url}/uploads/usuarios/no-image`;
      }
  }

}
