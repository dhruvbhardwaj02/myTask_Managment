import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { Task } from '../shared/task.model';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css'],
})
export class UserdashboardComponent {
  cancelCreate(form:any) {
   form.reset();
   this.showViewTask('user', null, true);
  }
  isCreateTaskVisible: boolean = false;
  isViewTaskVisible: boolean = false;
  isTaskDetailsVisible: boolean = false;
  isViewTeamsVisible: boolean = false;
  isViewTeamTaskVisible: boolean = false;

  updateMessage: string | null = null; // Message to display
  deleteMessage: string | null = null; // Message to display
  messageClass: string | null = null;   // CSS class for message styling

  task: Partial<Task> = {
    name: '',
    details: '',
    status: 'Pending',
    startDate: new Date(),
    endDate: new Date(),
    assign: null, // Default to null
    team: null,   // Default to null
  };

  teamTask: any[] = []; // List of tasks


  selectedTask: any = null;
  tasks: any[] = []; // List of tasks
  teams: any[] = []; // List of teams
  errorMessage: string = '';
  isViewTaskVisibleTeam: boolean = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private sharedService: SharedService,
    
  ) {this.showViewTask('user', null ,false)}

  // Show Create Task Form
  showCreateTask() {
    this.isCreateTaskVisible = true;
    this.isViewTaskVisible = false;
    this.isViewTeamsVisible = false;
    this.isTaskDetailsVisible = false;
    this.isViewTeamTaskVisible = false;
  }

  // Show Task List
  showViewTask(userType: string, team: string | null, flag: boolean) {
    this.isCreateTaskVisible = false;
    this.isViewTaskVisible = true;
    this.isViewTeamsVisible = false;
    this.isTaskDetailsVisible = false;
    this.isViewTaskVisibleTeam = flag;
    this.getTasks(userType, team); // Fetch tasks when switching to View Tasks.
    this.isViewTeamTaskVisible = false;
  }

  //show TeamTask
  showViewTeamTask(userType: string, team: string | null, flag: boolean) {
    this.isCreateTaskVisible = false;
    this.isViewTaskVisible = false;
    this.isViewTeamsVisible = false;
    this.isTaskDetailsVisible = false;
    this.isViewTaskVisibleTeam = flag;
    this.getTeamTask(userType, team); // Fetch tasks when switching to View Tasks.
    this.isViewTeamTaskVisible = true;
  }

  // Show Team List
  showViewTeam() {
    this.isCreateTaskVisible = false;
    this.isViewTaskVisible = false;
    this.isViewTeamsVisible = true;
    this.isTaskDetailsVisible = false;
    this.getTeams(); // Fetch teams when switching to View Teams.
    this.isViewTeamTaskVisible = false;
  }

  // Create Task API Integration
  createTask(type: string, form: any) {
    this.task.type = type;
    const userId = this.sharedService.getUserId();
    this.task.createdBy = userId;

    this.taskService.createTask(this.task as Task).subscribe(
      (response) => {
        if (response.status === 'true') {
          console.log('Task Created Successfully', response);
          this.showViewTask('user', null, this.isViewTaskVisibleTeam); // Refresh task list after creation
        } else {
          console.warn('Task creation failed', response);
        }
      },
      (error) => {
        console.error('Task Creation Error', error);
      }
    ); form.reset();
  }

  // Fetch Task List API
  getTasks(userType: string, team: string | null): void {
    const requestBody = {
      userId: this.sharedService.getUserId(),
      userType: userType,
      team: team,
    };

    this.taskService.getTasks(requestBody).subscribe({
      next: (response) => {
        if (response.status === 'true') {
          this.tasks = response.tasks;
        } else {
          console.warn('No tasks available', response);
        }
      },
      error: (error) => {
        console.error('Error fetching tasks', error);
      },
    });
  }


  // Fetch TeamTask List API
  getTeamTask(userType: string, team: string | null): void {
    const requestBody = {
      userId: this.sharedService.getUserId(),
      userType: userType,
      team: team,
    };

    this.taskService.getTasks(requestBody).subscribe({
      next: (response) => {
        if (response.status === 'true') {
          this.teamTask = response.tasks;
        } else {
          this.teamTask = [];
          console.warn('No tasks available', response);
        }
      },
      error: (error) => {
        console.error('Error fetching tasks', error);
      },
    });
  }

  // Fetch Teams API Integration
  getTeams(): void {

    const teamRequest = {
      userId: this.sharedService.getUserId(),
      userType: 'user'
    };

    // this.isViewTeamsVisible=true;

    this.taskService.getTeams(teamRequest).subscribe({
      next: (response) => {
        if (response.status === 'true') {
          this.teams = response.teams;
        } else {
          console.warn('No teams available', response);
        }
      },
      error: (error) => {
        console.error('Error fetching teams', error);
      },
    });
  }

  // Open Task Details
  openTaskDetails(task: any): void {
    this.selectedTask = { ...task }; // Clone task to avoid binding issues
    this.isTaskDetailsVisible = true;
    this.isViewTaskVisible = false;
    this.isCreateTaskVisible = false;
    this.isViewTeamsVisible = false;
    this.isViewTeamTaskVisible = false;
  }

  // Update Task API Integration
  updateTask(): void {
    if (this.selectedTask) {
      this.taskService.updateTask(this.selectedTask as Task).subscribe({
        next: (response) => {
          if (response.status === 'true') {
            this.updateMessage = response.message;
            this.messageClass = response.status ? 'success' : 'error';
            this.clearMessageAfterDelay();
            console.log('Task updated successfully', response);
            this.showViewTask('user', null, this.isViewTaskVisibleTeam); // Refresh task list after update
          } else {
            this.updateMessage = response.message;
            this.messageClass = 'error';
            console.warn('Task update failed', response);
            this.clearMessageAfterDelay();
          }
        },
        error: (error) => {
          console.error('Error updating task', error);
        },
      });
    }
  }

  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.updateMessage = null;
      this.messageClass = null;
    }, 3000);
  }


  // Delete Task API Integration
  deleteTask(): void {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask.id).subscribe({
        next: (response) => {
          if (response.status === 'true') {
            console.log('Task deleted successfully', response);
            this.showViewTask('user', null, this.isViewTaskVisibleTeam); // Refresh task list after deletion
          } else {
            console.warn('Task deletion failed', response);
          }
        },
        error: (error) => {
          console.error('Error deleting task', error);
        },
      });
    }
  }

  // Fetch Tasks by Team API Integration
  fetchTeamTasks(team: any): void {
    this.taskService.getTasksByTeam(team.id).subscribe({
      next: (response) => {
        if (response.status === 'true') {
          this.tasks = response.tasks;
          this.isViewTaskVisible = true;
          this.isViewTeamsVisible = false;
        } else {
          console.warn('No tasks available for the team', response);
        }
      },
      error: (error) => {
        console.error('Error fetching team tasks', error);
      },
    });
  }
}
