import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {name: '', password: '', email: '',role:''};

  constructor(private authService: AuthService , private router: Router) {}

  signup() {
    this.authService.signup(this.user).subscribe(
      response => {
        console.log('Sign Up Success', response);
        alert("User Registered Succesfully");
        this.router.navigate(['/signin']);
      },
      error => {
        console.error('Sign Up Error', error);
      }
    );
  }
}
