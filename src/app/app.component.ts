import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare var bootstrap: any; // For Bootstrap modal control
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Note: 'styleUrls' (not 'styleUrl')
})
export class AppComponent {
  title = 'myTask Management System';
  isSigninOrSignupRoute: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Listen for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        this.isSigninOrSignupRoute =
          currentRoute === '/signin' || currentRoute === '/signup' || currentRoute === '/home';
      });
  }

  // Show the logout confirmation modal
  logout(): void {
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
  }

  // Confirm logout: clear session, redirect, and close the modal
  confirmLogout(): void {
    // Clear session data
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');

    // Redirect to the Sign-In page
    this.router.navigate(['/signin']).then(() => {
      // Ensure the user cannot navigate back to the previous page
      window.history.pushState(null, '', '/signin');
      window.onpopstate = () => {
        window.history.go(1); // Push forward on back button press
      };
    });

    // Close the modal
    const logoutModal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
    if (logoutModal) {
      logoutModal.hide();
    }
  }

  // Cancel logout: simply close the modal
  cancelLogout(): void {
    const logoutModal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
    if (logoutModal) {
      logoutModal.hide();
    }
  }
}
