import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  getPeople() {
    // Get people from database
    return this.http.get('http://localhost:3025/people_more_details/');
  }
}
