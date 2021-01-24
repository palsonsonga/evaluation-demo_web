import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    audits = new MatTableDataSource();
    currentUser
    pageIndex = 0;
    pageSize = 10;
    timeFormate = ['12hr', '24hr']
    time = 'dd/MM/yyyy hh:mm:ss a'
    displayedColumns: string[] = ['user', '_id', 'loginTime', 'logoutTime', 'ip'];
    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService
    ) {
    }

    ngOnInit() {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x
        );
        this.loadAllAudits();
    }

    private loadAllAudits() { 
        this.auditService.getAll()
            .pipe(first())
            .subscribe(audits => { 
                this.audits = new MatTableDataSource(audits)
                this.audits.paginator = this.paginator;
                this.audits.sort = this.sort;
            });
    }

    applyFilter(value) {
        this.audits.filter = value.trim().toLowerCase()
    }
    timePicker(time) {
        if (time == '24hr') {
            this.time = 'dd/MM/yyyy HH:mm:SS'
        }
        else {
            this.time = 'dd/MM/yyyy hh:mm:ss a'
        }
    }
}
