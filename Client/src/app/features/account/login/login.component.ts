import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AccountService} from '../../../core/services/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCard} from "@angular/material/card";

import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatCard, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  returnUrl = '/shop';
  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    email: [''],
    password: [''],
  })
  private accountService = inject(AccountService);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);

  constructor() {
    const url = this.activateRoute.snapshot.queryParams['returnUrl'];
    if (url) this.returnUrl = url;
  }

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe();
        this.router.navigateByUrl(this.returnUrl);
      }
    })
  }
}
