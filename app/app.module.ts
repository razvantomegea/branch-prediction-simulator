import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
  ChartModule,
  CheckboxModule,
  DataTableModule,
  FieldsetModule,
  PickListModule,
  SharedModule,
  SpinnerModule
} from 'primeng/primeng';

import { AppComponent } from './app.component';
import { BenchmarkComponent } from './benchmark/benchmark.component';
import { DetectorComponent } from './detector/detector.component';
import { ChartResultsComponent } from './results/chart-results/chart-results.component';
import { PredictionService } from './prediction-history/prediction.service';
import { PredictorComponent } from './predictor/predictor.component';
import { StandardResultsComponent } from './results/standard-results/standard-results.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictorComponent,
    DetectorComponent,
    ChartResultsComponent,
    StandardResultsComponent,
    BenchmarkComponent
  ],
  imports: [
    BrowserModule,
    ChartModule,
    CheckboxModule,
    DataTableModule,
    FieldsetModule,
    FormsModule,
    HttpModule,
    PickListModule,
    SharedModule,
    SpinnerModule
  ],
  providers: [PredictionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
