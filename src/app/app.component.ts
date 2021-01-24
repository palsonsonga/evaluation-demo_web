import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';

import './_content/app.less';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

        if (this.currentUser != null && this.currentUser.role == 'Auditor') {
            this.router.navigate(['/audit'])
        }
    } 

    logout() {
        if (this.currentUser.role == "User") {
            this.authenticationService.logout(this.currentUser)
        }
        else
            this.authenticationService.logout(this.currentUser).toPromise().then(x =>
                this.router.navigate(['/login']));
    }
}
