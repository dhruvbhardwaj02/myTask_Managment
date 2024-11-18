import { Injectable } from '@angular/core';
import { Team } from './shared/team.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = 'http://localhost:5001'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  createTeam(team: Team): Observable<any> {
    return this.http.post(`${this.apiUrl}/team/create`, team);
  }

  deleteTeam(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/team/delete/${taskId}`);
  }
  updateTeam(team: Team): Observable<any> {
    return this.http.post(`${this.apiUrl}/team/update`, team);
  }

}
