import {Component, Input, OnInit} from '@angular/core';
import {interval, Observable} from "rxjs";
import {ApiServiceService} from "../../service/api-service.service";

@Component({
  selector: 'app-table-result',
  templateUrl: './table-result.component.html',
  styleUrls: ['./table-result.component.css']
})
export class TableResultComponent implements OnInit {
  @Input() people  any;
  constructor(private api: ApiServiceService) { }

  ngOnInit() {
    interval(100).subscribe(x => {
      this.people =    this.api.getPeople();
    });
  }

}
