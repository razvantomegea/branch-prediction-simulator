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
import { BenchmarkComponent, BenchmarkService } from './benchmark';
import { DetectorComponent, DetectorService } from './detector';
import { PredictorComponent, PredictorService } from './predictor';
import { ResultsComponent } from './results';

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
  providers: [BenchmarkService, DetectorService, PredictorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
