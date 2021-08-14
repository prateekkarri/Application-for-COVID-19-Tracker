import { Component, OnInit } from '@angular/core';
import { GlobalData } from '../models/globaldata';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  Confirmed = 0;
  Active = 0;
  Deaths = 0;
  Recovered = 0;
  globalData: GlobalData[];
  dummy: GlobalData[];
  datatable = [];
  chart = {
    PieChart: 'PieChart',
    BarChart: 'BarChart',
    LineChart: 'LineChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getGlobaldata().subscribe((res) => {
      // console.log(res);
      this.dummy = res;
      const slicedArray = this.dummy.slice(0, 10);
      this.globalData = slicedArray;
      console.log(slicedArray);

      res.forEach((cs) => {
        if (!Number.isNaN(cs.confirmed)) {
          this.Active += cs.active;
          this.Confirmed += cs.confirmed;
          this.Deaths += cs.deaths;
          this.Recovered += cs.active;
        }
      });
      this.initChart('c');
    });
  }

  updateChart(value) {
    // console.log(value);
    this.initChart(value);
  }

  initChart(caseType: string) {
    this.datatable = [];
    // this.datatable.push(["Country", "Cases"])

    this.globalData.forEach((cs) => {
      let value: number;
      if (caseType == 'c') {
        value = cs.confirmed;
      }

      if (caseType == 'a') {
        value = cs.active;
      }
      if (caseType == 'd') {
        value = cs.deaths;
      }

      if (caseType == 'r') {
        value = cs.recovered;
      }

      this.datatable.push([cs.country, value]);
    });
    // console.log(this.datatable);
  }
}
