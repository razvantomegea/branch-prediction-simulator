import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChartModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { PredictorComponent } from './predictor/predictor.component';
import { DetectorComponent } from './detector/detector.component';
import { ChartResultsComponent } from './chart-results/chart-results.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictorComponent,
    DetectorComponent,
    ChartResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
