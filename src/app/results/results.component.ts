import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { BenchmarkService } from '../benchmark';
import { Results } from './results';
import { ResultsService } from './results.service';

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
  constructor(private benchmarkSvc: BenchmarkService, private resultSvc: ResultsService) { }

  public saveResults(): void {
    this.benchmarkSvc.saveResults(this.results);
  }

  public showCharts(): void {
    this.chartData = this.resultSvc.setChartData(this.pathResults, this.noPathResults);
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
