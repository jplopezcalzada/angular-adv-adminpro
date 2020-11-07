import { Component, Input } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent{

  @Input('title') titulo = "Sin-titulo";
  // Doughnut
  @Input('labels') doughnutChartLabels: Label[] = ['labels', 'labels1', 'labels2'];
  
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];
  public colors: Color[] = [
    {backgroundColor: ['#6857E6', '#009FEE', '#F02059']  }];

}
