import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
  ButtonModule,
  ChartModule,
  CheckboxModule,
  DataTableModule,
  DialogModule,
  FieldsetModule,
  PickListModule,
  SharedModule,
  SpinnerModule
} from 'primeng/primeng';

import { AppComponent } from './app.component';
import { BenchmarkComponent } from './benchmark/benchmark.component';
import { BenchmarkService } from './benchmark/benchmark.service';
import { DetectorComponent} from './detector/detector.component';
import { DetectorService } from './detector/detector.service';
import { PredictorComponent } from './predictor/predictor.component';
import { PredictorService } from './predictor/predictor.service';
import { ResultsComponent } from './results/results.component';
import { ResultsService } from './results/results.service';

@NgModule({
  declarations: [
    AppComponent,
    BenchmarkComponent,
    PredictorComponent,
    DetectorComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    ChartModule,
    CheckboxModule,
    DataTableModule,
    DialogModule,
    FieldsetModule,
    FormsModule,
    HttpModule,
    PickListModule,
    SharedModule,
    SpinnerModule
  ],
  providers: [BenchmarkService, DetectorService, PredictorService, ResultsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
