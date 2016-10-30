import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChartModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { DetectorComponent } from './detector/detector.component';
import { ChartResultsComponent, StandardResultsComponent } from './results';
import { PredictionService } from './prediction-history';
import { PredictorComponent } from './predictor/predictor.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictorComponent,
    DetectorComponent,
    ChartResultsComponent,
    StandardResultsComponent
  ],
  imports: [
    BrowserModule,
    ChartModule,
    FormsModule,
    HttpModule
  ],
  providers: [PredictionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
