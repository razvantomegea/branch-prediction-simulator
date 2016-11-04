import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import * as FileSaver from "file-saver";

@Injectable()
export class BenchmarkService {
  constructor(private http: Http) {}

  public getBenchmarcks(benchmarkNames: string[]): Observable<any> {
    let httpCalls: Observable<Response>[] = [];
    benchmarkNames.forEach((bchMark: string) => httpCalls.push(this.http.get(`/assets/traces/${bchMark}.TRA`).map((res: Response) => res)));
    return Observable.forkJoin(httpCalls);
  }

  public saveResults(results: any): void {
    let blob = new Blob([JSON.stringify(results, null, 4)], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "results.txt");
  }

}
