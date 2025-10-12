import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-server-error',
  imports: [
    MatCard
  ],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss'
})
export class ServerErrorComponent {
  error?: any;
  private router = inject(Router);

  constructor() {
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras.state?.['error'];
  }

}
