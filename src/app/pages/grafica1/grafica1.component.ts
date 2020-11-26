import { Component } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = ['Diesel', 'Adblue', '95'];
  public dataset1 = [
    [50, 10, 40],
  ];
  public labels2: string[] = ['Comerciales', 'Vacio'];
  public dataset2 = [
    [80, 20]
  ];
  public labels3: string[] = ['Comerciales', 'Vacio'];
  public dataset3 = [
    [80, 20]
  ];
}
