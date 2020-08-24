import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {
  @Input() deviceXs: boolean;
  topVal = 0;
  data = [];
  selectedYear;
  isLaunchSuccess = false;
  isLandSuccess = false;
  isSpinner = true;
  noDataAvailable = 'Data not found';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    // api hit
    this.getRecords();
  }
  // this method will hit api to load data
  getRecords(): void {
    const url = this.prepareUrl();
    this.isSpinner = true;
    const res = this.http.get(url).pipe(
      catchError((error) => {
        console.log('something went wrong ', error);
        this.isSpinner = false;
        return Observable.throw('Something went wrong ;)');
      })
    );
    res.subscribe((resData: any) => {
      this.data = resData;
      this.isSpinner = false;
    });
    this.data = [];
  }
  // this method will prepare url for api to filter out the data
  prepareUrl(): string {
    let url = 'https://api.spacexdata.com/v3/launches?limit=20';
    if (this.isLaunchSuccess) {
      url = `${url}&launch_success=${this.isLaunchSuccess}`;
    }
    if (this.isLandSuccess) {
      url = `${url}&land_success=${this.isLandSuccess}`;
    }
    if (this.selectedYear) {
      url = `${url}&launch_year=${this.selectedYear}`;
    }
    return url;
  }
  // this method set selected year value and hit api to load data
  selectYear(index): void {
    this.selectedYear = 2006 + index;
    this.getRecords();
  }
  // this method return class to apply on year buttons section
  yearBtnClass(index): string {
    if (this.selectedYear === 2006 + index) {
      return 'selected-year-btn';
    }
    return 'default-year-btn';
  }
  // this method set isLaunchSuccess value and hit api to load data
  successfulLaunchClicked(clickedBtn): void {
    if (clickedBtn && !this.isLaunchSuccess) {
      this.isLaunchSuccess = true;
      this.getRecords();
    }
    if (!clickedBtn && this.isLaunchSuccess) {
      this.isLaunchSuccess = false;
      this.getRecords();
    }
  }
  // this method set isLandSuccess value and hit api to load data
  successfulLandingClicked(clickedBtn): void {
    if (clickedBtn && !this.isLandSuccess) {
      this.isLandSuccess = true;
      this.getRecords();
    }
    if (!clickedBtn && this.isLandSuccess) {
      this.isLandSuccess = false;
      this.getRecords();
    }
  }
  onScroll(e) {
    const scrollXs = this.deviceXs ? 55 : 73;
    if (e.srcElement.scrollTop < scrollXs) {
      this.topVal = e.srcElement.scrollTop;
    } else {
      this.topVal = scrollXs;
    }
  }
  sideBarScroll() {
    const e = this.deviceXs ? 46 : 74;
    return e - this.topVal;
  }
}
