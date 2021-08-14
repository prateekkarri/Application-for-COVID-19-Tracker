import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseData } from '../models/datewise';
import { GlobalData } from '../models/globaldata';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  data: GlobalData[];
  countries: string[] = [];

  Confirmed = 0;
  Active = 0;
  Deaths = 0;
  Recovered = 0;
  dateWiseData;

  selectedCountry: DateWiseData[];

  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    LineChart: 'LineChart',
    height: 300,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };

  datatable = [];
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    merge(
      this.api.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.api.getGlobaldata().pipe(
        map((res) => {
          const slicedArray = res;
          this.data = slicedArray.slice(0, 10);
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('US');
        this.updateChart();
      },
    });

    // this.api.getDateWiseData().subscribe((result) => {
    //   // console.log(res1);

    //   this.updateChart();
    // });
  }

  updateValues(country: string) {
    // console.log(country);

    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.Active = cs.active;
        this.Deaths = cs.deaths;
        this.Recovered = cs.recovered;
        this.Confirmed = cs.confirmed;
      }
    });

    this.selectedCountry = this.dateWiseData[country];
    console.log(this.selectedCountry);
    this.updateChart();
  }

  updateChart() {
    this.datatable = [];
    // this.datatable.push(['Cases', 'Date']);
    this.selectedCountry.forEach((cs) => {
      this.datatable.push([cs.date, cs.cases]);
    });
  }
}
