import { Injectable } from '@angular/core';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userId: string = '';
  teams: Team[] = [];

  getteams(): Team[] {
    return this.teams;
  }

  // Setter for teams
  setteams(teams: Team[]) {
    console.log('Teams updated:', teams);
    this.teams = teams;
  }

  setUserId(id: string): void {
    this.userId = id;
  }

  getUserId(): string {
    return this.userId;
  }

}
