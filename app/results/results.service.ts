import { Injectable } from '@angular/core';

import { Results } from './results';

@Injectable()
export class ResultsService {

  constructor() { }

  public setChartData(pathRes: Results[], noPathRes: Results[]): any {
    let chartObj: any = {
      labels: [],
      datasets: [
        {
          label: 'Bias without path',
          backgroundColor: 'silver',
          borderColor: 'silver',
          data: []
        },
        {
          label: 'Bias with path',
          backgroundColor: 'blue',
          borderColor: 'blue',
          data: []
        }
      ]
    }

    let sum: number = 0, average: number = 0;
    pathRes.forEach((res: Results) => {
      let bias: number = parseInt(res.bias.substring(0, res.bias.length - 1));
      chartObj.labels.push(res.traceName);
      chartObj.datasets[0].data.push(bias);
      sum += bias;
    });
    average = sum / chartObj.datasets[0].data.length;
    chartObj.labels.push('Average');
    chartObj.datasets[0].data.push(average);

    sum = average = 0;
    noPathRes.forEach((res: Results) => {
      if (chartObj.labels.indexOf(res.traceName) === -1) {
        chartObj.labels.push(res.traceName);
      }
      let bias: number = parseInt(res.bias.substring(0, res.bias.length - 1));
      chartObj.datasets[1].data.push(bias);
      sum += bias;
    });

    average = sum / chartObj.datasets[1].data.length;
    chartObj.datasets[1].data.push(average);

    return chartObj;
  }

}
