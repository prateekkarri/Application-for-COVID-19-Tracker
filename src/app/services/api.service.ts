import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalData } from '../models/globaldata';
import { DateWiseData } from '../models/datewise';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-17-2020.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  result: any = [];

  constructor(private http: HttpClient) {}

  getGlobaldata() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map((res) => {
        // console.log(res);
        const data: GlobalData[] = [];
        const raw = {};

        const rows = res.split('\n');
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach((row) => {
          const cols = row.split(/,(?=\S)/);

          const cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          const temp: GlobalData = raw[cs.country];
          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
        });

        // console.log('RAAW', Object.values(raw));
        // tslint:disable-next-line:prefer-for-of
        // for (let i = 0; Object.values(raw).length <= 10; i++) {
        //   this.result.push((Object.values(raw)));
        //   console.log('result', this.result);
        // }
        // return Object.values(raw);
        return Object.values(raw) as GlobalData[];
      })
    );
  }

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        const rows = result.split('\n');
        // console.log(rows);
        const mainData = {};
        const header = rows[0];
        const dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach((row) => {
          const cols = row.split(/,(?=\S)/);
          const con = cols[1];
          cols.splice(0, 4);
          // console.log(con, cols);
          mainData[con] = [];
          cols.forEach((value, index) => {
            const dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index])),
            };
            mainData[con].push(dw);
          });
        });

        // console.log(mainData);
        return mainData;
      })
    );
  }
}
