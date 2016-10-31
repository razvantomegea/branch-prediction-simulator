import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
  ButtonModule,
  ChartModule,
  CheckboxModule,
  DataTableModule,
  FieldsetModule,
  PickListModule,
  SharedModule,
  SpinnerModule
} from 'primeng/primeng';

import { AppComponent } from './app.component';
import { BenchmarkComponent, BenchmarkService } from './benchmark';
import { DetectorComponent, DetectorService } from './detector';
import { ChartResultsComponent, StandardResultsComponent } from './results';
import { PredictionService } from './prediction-history';
import { PredictorComponent } from './predictor/predictor.component';

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
    ButtonModule,
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
  providers: [BenchmarkService, DetectorService, PredictionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
