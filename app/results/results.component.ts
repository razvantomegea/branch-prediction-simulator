import { Component, Input, OnChanges } from '@angular/core';

import { BenchmarkService } from '../benchmark/benchmark.service';
import { Results } from './results';
import { ResultsService } from './results.service';

@Component({
  moduleId: module.id,
  selector: 'app-results',
  templateUrl: 'results.component.html',
  styleUrls: ['results.component.sass']
})
export class ResultsComponent implements OnChanges {
  @Input('results') results: Results[];
  public chartData: any;
  public chartOptions: any;
  public noPathResultsDetection: Results[];
  public noPathResultsPrediction: Results[];
  public noResults: boolean;
  public pathResultsDetection: Results[];
  public pathResultsPrediction: Results[];
  public showDetectionChart: boolean = false;
  public showPredictionChart: boolean = false;
  constructor(private benchmarkSvc: BenchmarkService, private resultSvc: ResultsService) {
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
        text: ''
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

  public saveResults(): void {
    this.benchmarkSvc.saveResults(this.results);
  }

  public showDetectionCharts(): void {
    this.chartData = this.resultSvc.setChartData(this.pathResultsDetection, this.noPathResultsDetection);
    this.chartOptions.title.text = 'Detection results';
    this.showDetectionChart = true;
  }

  public showPredictionCharts(): void {
    this.chartData = this.resultSvc.setChartData(this.pathResultsPrediction, this.noPathResultsPrediction);
    this.chartOptions.title.text = 'Prediction results';
    this.showPredictionChart = true;
  }

  ngOnChanges(changes: any): void {
    let newResult: Results = changes.results.currentValue[0];
    this.noResults = changes.results.currentValue.length === 0;
    if (!!newResult) {
      if (newResult.withPath) {
        if (newResult.isPrediction) {
          this.pathResultsPrediction = [...this.results];
        } else {
          this.pathResultsDetection = [...this.results];
        }
      } else {
        if (newResult.isPrediction) {
          this.noPathResultsPrediction = [...this.results];
        } else {
          this.noPathResultsDetection = [...this.results];
        }
      }
    }
    console.log(this.chartData);
  }

}
