import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

  private apiUrl = 'http://localhost:5001'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  // Create a new task
  fetchAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/fetch`);
  }
  getTeamMembers(requestBody: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/team/member/fetch`, requestBody);
  }
  addTeamMember(requestBody: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/team/member/add`, requestBody);
  }

}
