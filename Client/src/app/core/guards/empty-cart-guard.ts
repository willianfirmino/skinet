import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {CartService} from '../service/cart.service';
import {SnackbarService} from '../services/snackbar.service';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const snake = inject(SnackbarService);

  if (!cartService.cart() || cartService.cart()?.items.length === 0) {
    snake.error('Your cart is empty')
    router.navigateByUrl('/cart');
    return false;
  }
  return true;
};
