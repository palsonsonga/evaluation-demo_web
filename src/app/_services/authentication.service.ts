import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient,private router:Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User { 
        return this.currentUserSubject.value;
    }

    login(username, password) {
        return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout(user){
        // 
        if (user.role == 'User') {
            localStorage.removeItem('currentUser');
            //
            this.currentUserSubject.next(null);
            this.router.navigate(['/login'])
            return user
        }
         else{
            let audit = {
                user: user.session.user,
                loginTime: user.session.loginTime,
                logoutTime: Date.now(),
                ip: user.session.ip,
                role: user.role
            }  
            return this.http.put<any>(`${config.apiUrl}/audits/${user.session.id}`, audit)
                .pipe(
                    map(user => {
                        localStorage.removeItem('currentUser');
                        //
                        this.currentUserSubject.next(null);
                        //
                        return user;
                    }));
         }
        // 
        }
    }
