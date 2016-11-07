import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { BenchmarkService } from '../benchmark';
import { Results } from '../results';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.sass']
})
export class ResultsComponent implements OnChanges, OnInit {
  @Input('results') results: Results[];
  public chartData: any;
  public chartOptions: any;
  public noPathResults: Results[];
  public noResults: boolean;
  public pathResults: Results[];
  public showChart: boolean = false;
  constructor(private benchmarkSvc: BenchmarkService) { }

  public saveResults(): void {
    this.benchmarkSvc.saveResults(this.results);
  }

  public showCharts(): void {
    this.chartData = {
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

    this.pathResults.forEach((res: Results) => {
      this.chartData.labels.push(res.traceName);
      this.chartData.datasets[0].data.push(parseInt(res.bias.substring(0, res.bias.length - 1)));
    });

    this.chartData.labels.push('Average');
    let average: number = this.chartData.datasets[0].data.reduce((prev: number, curr: number) => prev + curr);
    this.chartData.datasets[0].data.push(average);

    this.noPathResults.forEach((res: Results) => {
      if (this.chartData.labels.indexOf(res.traceName) === -1) {
        this.chartData.labels.push(res.traceName);
      }
      this.chartData.datasets[1].data.push(parseInt(res.bias.substring(0, res.bias.length - 1)));
    });

    average = this.chartData.datasets[1].data.reduce((prev: number, curr: number) => prev + curr);
    this.chartData.datasets[1].data.push(average);
    this.showChart = true;
  }

  ngOnChanges(changes: any): void {
    let newResult: Results = changes.results.currentValue[0];
    this.noResults = changes.results.currentValue.length === 0;
    if (!!newResult && newResult.withPath) {
      this.pathResults = [...this.results];
    } else {
      this.noPathResults = [...this.results];
    }
    console.log(this.chartData);
  }

  ngOnInit(): void {
    this.chartData = {
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

    this.chartOptions = {
      legend: {
        labels: {
          fontColor: 'white'
        }
      },
      title: {
        display: true,
        fontColor: 'white',
        text: 'Detection/prediction results'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: 'white'
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: 'white'
          },
        }]
      }
    }
  }

}
