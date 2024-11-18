import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { SharedService } from '../shared/shared.service';
import { Task } from '../shared/task.model';
import { Team } from '../shared/team.model';
import { TeamService } from '../team.service';
import { TeamMemberService } from '../team-member.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {

  onTeamChange(teamid: any) {
    // this.viewTeamMembersDropdown(this.selectedTeamIdOnDropdown);
    this.viewTeamMembersDropdown(teamid);

  }
  editableTeamId: number | null = null; // Track the team being edited
  isTeamsVisible: boolean = true;
  isTasksVisible: boolean = false;
  isCreateTeamVisible: boolean = false;
  isCreateTaskVisible: boolean = false;
  isTaskListVisible: boolean = false;
  isTeamListVisible: boolean = false;
  isTaskDetailsVisible: boolean = false;
  isAddMemberModalVisible = false;
  isViewMembersModalVisible = false;
  selectedTeamIdOnDropdown: any = null;
  selectedTask: any = null;
  teams: any[] = [];
  tasks: any[] = [];
  currentView: 'teamList' | 'addMember' | 'taskList' = 'taskList';
  currentTeam: string = '';
  users: any[] = []; // List of all users
  teamMembers: any[] = [];
  teamMembersBasedOnTeam: any[] = [];
  // Members of a specific team
  // Show Add Member Modal
  openAddMemberModal(teamId: number) {
    this.selectedTeamId = teamId;
    this.isAddMemberModalVisible = true;
    this.isTeamsVisible = false;
    this.fetchAllUsers();
    this.isTeamTaskVisibleOnClick = false;
    this.isTeamListVisible = false;
    this.isViewMembersModalVisible = false;
  }

  // Close Add Member Modal
  closeAddMemberModal() {
    this.isAddMemberModalVisible = false;
    this.selectedTeamId = null;
    this.selectedUserId = null;
    this.isTeamTaskVisibleOnClick = false;
    this.isViewMembersModalVisible = false;
    this.showTeams();
  }

  // Fetch all users from the API
  fetchAllUsers() {

    this.teamMemberService.fetchAllUsers().subscribe({
      next: (response) => {
        if (response.status === 'true') {
          this.users = response.users;
        } else {
          console.warn('no users  available', response);
        }
      },
      error: (error) => {
        console.error('Error fetching users', error);
      },
    });
  }

  // Close View Members Modal
  closeViewMembersModal() {
    this.isViewMembersModalVisible = false;
    this.teamMembers = [];
    this.showTeams();
  }
  selectedTeamId: number | null = null;
  selectedUserId: number | null = null;
  newTeam = { name: '', size: 0, detail: '' };
  // newTask = { name: '', assign: '', teamName: '', startDate: '', endDate: '', status: 'Pending', type: '', createdBy: '', details:''};
  newTask: Partial<Task> = {
    name: '',
    details: '',
    status: 'Pending',
    startDate: new Date(),
    endDate: new Date(),
    assign: null, // Default to null
    team: null,   // Default to null
  };

  team: Partial<Team> = {
    createdBy: '',
    name: '',
    size: '',
    details: ''
  };

  task: Partial<Task> = {
    name: '',
    details: '',
    status: 'Pending',
    startDate: new Date(),
    endDate: new Date(),
    assign: null, // Default to null
    team: null,   // Default to null
  };

  constructor(private teamMemberService: TeamMemberService, private taskService: TaskService, private teamService: TeamService, private router: Router, private http: HttpClient, private sharedService: SharedService) {
    this.fetchTeams();
    this.getUnassignedTasks();

    this.fetchAllUsers();
  }

  showTeams() {
    this.isTeamTaskVisibleOnClick = false;
    this.isTeamsVisible = true;
    this.isTeamListVisible = true
    this.isTasksVisible = false;
    this.isCreateTeamVisible = false;
    this.isCreateTaskVisible = false;
    this.isTaskDetailsVisible = false;
    this.isAddMemberModalVisible = false;
    this.isViewMembersModalVisible = false;
    this.fetchTeams();
  }

  showTasks() {
    this.isAddMemberModalVisible = false;
    this.isTeamTaskVisibleOnClick = false;
    this.isTasksVisible = true;
    this.isTaskListVisible = true;
    this.isTeamsVisible = false;
    this.isTeamListVisible = false;
    this.isCreateTeamVisible = false;
    this.isCreateTaskVisible = false;
    this.isViewMembersModalVisible = false;
    this.isTaskDetailsVisible = false;
    // Modified getTasks to show unassigned tasks
    this.getUnassignedTasks();
  }

  openTaskDetails(task: Task): void {
    this.isTeamTaskVisibleOnClick = false;
    this.selectedTask = { ...task };
    console.log(task);
    this.isTaskDetailsVisible = true;
    this.redirectionfromSourcePage = 'tasks';
    this.teams = this.sharedService.getteams();
    this.isTeamListVisible = false;
    this.isTaskListVisible = false;
    this.isTasksVisible = false;
    this.isAddMemberModalVisible = false;
    this.isViewMembersModalVisible = false;
  }
  openTaskDetailsUpdate(task: Task): void {
    this.isViewMembersModalVisible = false;
    this.isTeamTaskVisibleOnClick = false;
    this.isAddMemberModalVisible = false;
    this.isTeamsVisible = false;
    console.log(task);
    this.selectedTask = { ...task };
    this.isTaskDetailsVisible = true;
    this.redirectionfromSourcePage = 'teams';
    this.teams = this.sharedService.getteams();
    this.isTeamListVisible = false;
    this.isTaskListVisible = false;
  }

  showCreateTeam() {
    this.isTeamTaskVisibleOnClick = false;
    this.isCreateTeamVisible = true;
    this.isTeamListVisible = false;
    this.isTaskDetailsVisible = false;
  }

  showCreateTask() {
    this.isTeamTaskVisibleOnClick = false;
    this.isCreateTaskVisible = true;
    this.isTaskListVisible = false;
    this.isTaskDetailsVisible = false;
    this.isTeamListVisible = false;
    this.teams = this.sharedService.getteams();
  }

  fetchTeams() {

    const teamRequest = {
      userId: this.sharedService.getUserId(),
      userType: 'admin'
    };

    this.isTeamListVisible = true;

    this.taskService.getTeams(teamRequest).subscribe({
      next: (response) => {
        if (response.status === 'true') {
          this.teams = response.teams;
          this.sharedService.setteams(this.teams);
        } else {
          this.teams = [];
          this.sharedService.setteams([]);
          console.warn('No teams available', response);
        }
      },
      error: (error) => {
        console.error('Error fetching teams', error);
      },
    });
  }

  fetchTasks() {
    this.http.get<any[]>('http://localhost:3000/tasks').subscribe((data) => {
      this.tasks = data;
    });
  }


  createTeam(form: any) {
    const userId = this.sharedService.getUserId();
    this.team.createdBy = userId;

    this.teamService.createTeam(this.team as Team).subscribe(
      (response) => {
        if (response.status === 'true') {
          console.log('Team Created Successfully', response);
          this.showTeams();
          // this.showViewTask('user', null, this.isViewTaskVisibleTeam); // Refresh task list after creation
        } else {
          console.warn('Team creation failed', response);
        }
      },
      (error) => {
        console.error('Team Creation Error', error);
      }
    ); form.reset();
  }

  createTask(name: string) {

    this.newTask.type = name;
    const userId = this.sharedService.getUserId();
    this.newTask.createdBy = userId;

    this.taskService.createTask(this.newTask as Task).subscribe(
      response => {

        if (response.status == 'true') {
          console.log('Task Created Sucessfully', response);
        }

      },
      error => {
        console.error('Task Creation Error', error);
      }
    );

  }
  // Add a team member to the selected team
  addTeamMember(form: any) {
    if (this.selectedTeamId && this.selectedUserId) {
      const requestBody = {
        teamId: this.selectedTeamId,
        userId: this.selectedUserId
      };

      this.teamMemberService.addTeamMember(requestBody).subscribe(
        (response) => {
          if (response.status === 'true') {
            console.log('user added successfully', response);
            this.showTeams();
          } else {
            console.warn('user addition to team failed', response);
          }
        },
        (error) => {
          console.error('error in adding teammeber', error);
        }
      ); form.reset();
    }
  }
  viewTeamMembersDropdown(teamId: number) {
    const requestBody = {
      teamId: teamId

    };

    this.teamMemberService.getTeamMembers(requestBody).subscribe(
      (response) => {
        if (response.status === 'true') {
          console.log('user added successfully', response);
          this.teamMembersBasedOnTeam = response.members; // Expecting [{ name: 'User1', email: 'user1@example.com' }, ...]
          //   this.isViewMembersModalVisible = true;
        } else {
          this.teamMembersBasedOnTeam = [];
          console.warn('user addition to team failed', response);
        }
      },
      (error) => {
        console.error('error in adding teammeber', error);
      }
    );
  }
  // View Members of a Team
  viewTeamMembers(teamId: number) {
    const requestBody = {
      teamId: teamId

    };

    this.isTeamsVisible = false;

    this.teamMemberService.getTeamMembers(requestBody).subscribe(
      (response) => {
        if (response.status === 'true') {
          console.log('user added successfully', response);
          this.teamMembers = response.members; // Expecting [{ name: 'User1', email: 'user1@example.com' }, ...]
          this.isViewMembersModalVisible = true;
          this.isTeamsVisible = false;
        } else {
          this.isViewMembersModalVisible = false;
          this.isTeamsVisible = true;

          console.warn('user addition to team failed', response);
        }
      },
      (error) => {
        console.error('error in adding teammeber', error);
      }
    );
  }
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
  redirectionfromSourcePage: string = '';//for update if called from team should redirect to teams otherwise called from task should redirect to task
  // Update Task API Integration
  updateTask(): void {
    // this.selectedTask.team = this.selectedTeamIdOnDropdown;
    this.selectedTask.createdBy = this.sharedService.getUserId();

    if (this.selectedTask) {
      this.taskService.updateTask(this.selectedTask as Task).subscribe({
        next: (response) => {
          if (response.status === 'true') {
            this.updateMessage = response.message;
            this.messageClass = response.status ? 'success' : 'error';
            this.clearMessageAfterDelay();
            console.log('Task updated successfully', response);
            if (this.redirectionfromSourcePage == 'teams') {
              this.showTeams();
            } else { this.showTasks(); } // Refresh task list after update
          } else {
            this.updateMessage = response.message;
            this.messageClass = 'error';
            console.warn('Task update failed', response);
            if (this.redirectionfromSourcePage == 'teams') {
              this.showTeams();
            } else { this.showTasks(); }
            this.clearMessageAfterDelay();
          }
        },
        error: (error) => {
          console.error('Error updating task', error);
        },
      });
    }
  }
  updateMessage: string | null = null; // Message to display
  deleteMessage: string | null = null; // Message to display
  messageClass: string | null = null;   // CSS class for message styling
  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.updateMessage = null;
      this.deleteMessage = null;
      this.messageClass = null;
    }, 1000);
  }


  // Delete Task API Integration
  deleteTask(): void {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask.id).subscribe({
        next: (response) => {
          if (response.status === 'true') {
            this.deleteMessage = response.message;
            this.messageClass = response.status ? 'success' : 'error';
            this.clearMessageAfterDelay();
            console.log('Task deleted successfully', response);
            if (this.redirectionfromSourcePage == 'teams') {
              this.showTeams();
            } else { this.showTasks(); } // Refresh task list after deletion
          } else {
            this.deleteMessage = response.message;
            this.messageClass = 'error';
            this.clearMessageAfterDelay();
            console.warn('Task deletion failed', response);
            if (this.redirectionfromSourcePage == 'teams') {
              this.showTeams();
            } else { this.showTasks(); }
          }
        },
        error: (error) => {
          console.error('Error deleting task', error);
        },
      });
    }
  }


  getUnassignedTasks(): void {
    const requestBody = {
      userId: this.sharedService.getUserId(),
      userType: 'admin',
      team: null
    };

    this.taskService.getTasks(requestBody).subscribe(
      (response) => {
        if (response.status === 'true') {
          this.tasks = response.tasks;
        } else {
          this.tasks = [];
          console.warn('No unassigned tasks available', response);
        }
      },
      (error) => {
        console.error('Error fetching unassigned tasks', error);
        this.tasks = []; // Ensure tasks is empty on error
      }
    );
  }



  teamTasks: any[] = [];
  fetchTeamTasks(teamId: string) {
    this.fectchTeamTask('admin', teamId);
    this.isTeamTaskVisibleOnClick = true;
    this.viewTeamMembersDropdown(+teamId);
    this.isTeamsVisible = false;
    this.isTasksVisible = false;
    this.isTeamListVisible = false;
    this.isCreateTeamVisible = false;
    this.isCreateTaskVisible = false;
    this.isTaskDetailsVisible = false;
  }
  fectchTeamTask(userType: string, teamId: string) {
    const requestBody = {
      userId: this.sharedService.getUserId(),
      userType: userType,
      team: teamId,
    };

    this.taskService.getTasks(requestBody).subscribe({
      next: (response) => {
        if (response.status === 'true') {

          this.teamTasks = response.tasks;
        } else {
          this.teamTasks = [];
          console.warn('No tasks available', response);
        }
      },
      error: (error) => {
        console.error('Error fetching tasks', error);
      },
    });
  }
  deleteTeam(teamId: any) {
    this.teamService.deleteTeam(teamId).subscribe({
      next: (response) => {
        if (response.status === 'true') {
          this.deleteMessage = response.message;
          this.messageClass = response.status ? 'success' : 'error';
          this.clearMessageAfterDelay();
          console.log('Task deleted successfully', response);
          this.showTeams(); // Refresh task list after deletion
        } else {
          this.deleteMessage = response.message;
          this.messageClass = 'error';
          this.clearMessageAfterDelay();
          console.warn('Task deletion failed', response);
        }
      },
      error: (error) => {
        console.error('Error deleting task', error);
      },
    });
  }
  enableEditing(teamId: number) {
    this.editableTeamId = teamId; // Set the editable team's ID
  }

  updateTeam(team: Team) {
    // Simulate saving the updated size to the server or backend
    console.log('Updated Team:', team);
    this.editableTeamId = null; // Exit editing mode
    this.teamService.updateTeam(team as Team).subscribe(
      (response) => {
        if (response.status === 'true') {
          this.updateMessage = response.message;
          this.messageClass = response.status ? 'success' : 'error';
          this.clearMessageAfterDelay();
          console.log('Task updated successfully', response);
          this.showTeams(); // Refresh task list after update
        } else {
          this.updateMessage = response.message;
          this.messageClass = 'error';
          console.warn('Task update failed', response);
          this.clearMessageAfterDelay();
        }
      },
      (error) => {
        console.error('Error updating task', error);
      }
    );
  }
  isTeamTaskVisibleOnClick: boolean = false;
}
