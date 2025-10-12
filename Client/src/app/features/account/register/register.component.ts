import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountService} from '../../../core/services/account.service';
import {Router} from '@angular/router';
import {SnackbarService} from '../../../core/services/snackbar.service';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {TextInputComponent} from '../../../shared/components/text-input/text-input.component';


@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    ReactiveFormsModule,
    TextInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  validationErrors?: string[];
  private fb = inject(FormBuilder)
  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snake = inject(SnackbarService);

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snake.success('Registration successful - you can now login');
        this.router.navigateByUrl('/account/login');
      },
      error: errors => this.validationErrors = errors
    })
  }
}
