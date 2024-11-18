import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  credentials = { email: '', password: '' };

  errorMessage: string = '';
  userid: string = '';
  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService) { }

  signin() {
    this.authService.signin(this.credentials).subscribe(
      response => {

        if (response.status == 'true') {
          const userId = response.userId; // Replace with your API's response structure
          alert("logged Sucessfully");
          this.sharedService.setUserId(userId); // Save userId in the service
          if (response.role === 'user') {
            this.router.navigate(['/userdashboard']);
          } else if (response.role === 'admin') {
            this.router.navigate(['/admindashboard']);
          }
        } else {
          this.errorMessage = response.message;
        }

        console.log('Sign In Success', response);
      },
      error => {
        console.error('Sign In Error', error);
      }
    );
  }
}
