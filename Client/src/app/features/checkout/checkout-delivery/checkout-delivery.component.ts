import {Component, inject, OnInit, output} from '@angular/core';
import {CheckoutService} from '../../../core/services/checkout.service';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../../core/service/cart.service';
import {DeliveryMethod} from '../../../shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        if (this.cartService.cart()?.deleveryMethodId) {
          const method = methods.find(x => x.id === this.cartService.cart()?.deleveryMethodId);
          if (method) {
            this.cartService.selectedDelivery.set(method);
            this.deliveryComplete.emit(true);
          }
        }
      }
    });
  }

  updateDeliveryMethod(method: DeliveryMethod) {
    this.cartService.selectedDelivery.set(method);
    const cart = this.cartService.cart();
    if (cart) {
      cart.deleveryMethodId = method.id;
      this.cartService.setCart(cart);
      this.deliveryComplete.emit(true);
    }
  }


}
