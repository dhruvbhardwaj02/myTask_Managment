import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './shared/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:5001'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  // Create a new task
  createTask(task: Task): Observable<any> {
    return this.http.post(`${this.apiUrl}/task/create`, task);
  }
  
  // // Get the list of tasks
  getTasks(requestBody: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/task/fetch`, requestBody);
  }

  updateTask(task: Task): Observable<any> {
    return this.http.post(`${this.apiUrl}/task/update`, task);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/task/delete/${taskId}`);
  }

  getTeams(requestBody: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/team/get`, requestBody);
  }

  getTasksByTeam(teamId: string): Observable<any> {
    return this.http.get(`/api/teams/${teamId}/tasks`);
  }

}
