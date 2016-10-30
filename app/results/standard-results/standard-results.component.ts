import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-standard-results',
  templateUrl: 'standard-results.component.html',
  styleUrls: ['standard-results.component.sass']
})
export class StandardResultsComponent implements OnInit {
  public results: any[];
  constructor() { }

  ngOnInit() {
    this.results = [{
      benchmark: "FSORT",
      percentage: "98%"
    }];
  }

}
