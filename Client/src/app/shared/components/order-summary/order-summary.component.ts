import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {CartService} from '../../../core/service/cart.service';
import {CurrencyPipe, Location} from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    CurrencyPipe
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  cartService = inject(CartService);
  location = inject(Location);

}
