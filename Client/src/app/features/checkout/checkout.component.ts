import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {OrderSummaryComponent} from '../../shared/components/order-summary/order-summary.component';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {StripeService} from '../../core/services/stripe.service';
import {
  ConfirmationToken,
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripePaymentElement,
  StripePaymentElementChangeEvent
} from '@stripe/stripe-js';
import {SnackbarService} from '../../core/services/snackbar.service';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {firstValueFrom} from 'rxjs';
import {AccountService} from '../../core/services/account.service';
import {Address} from '../../shared/models/user';
import {CheckoutDeliveryComponent} from './checkout-delivery/checkout-delivery.component';
import {CheckoutReviewComponent} from './checkout-review/checkout-review.component';
import {CartService} from '../../core/service/cart.service';
import {CurrencyPipe} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepper,
    MatStep,
    RouterLink,
    MatButton,
    MatStepperNext,
    MatCheckbox,
    CheckoutDeliveryComponent,
    MatStepperPrevious,
    CheckoutReviewComponent,
    CurrencyPipe,
    MatProgressSpinner
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  addressElement?: StripeAddressElement;
  saveAddress = false;
  paymentElement?: StripePaymentElement;
  cartService = inject(CartService);
  completionStatus = signal<{ address: boolean, card: boolean, delivery: boolean }>(
    {address: false, card: false, delivery: false}
  );
  confirmationToken?: ConfirmationToken;
  loading = false;
  private stripService = inject(StripeService);
  private snackBar = inject(SnackbarService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  ngOnDestroy(): void {
    this.stripService.disposeElements();
  }

  async ngOnInit() {
    try {
      this.addressElement = await this.stripService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);
      this.paymentElement = await this.stripService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
    } catch (error: any) {
      this.snackBar.error(error.message);
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    })
  }
  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state;
    })
  }

  handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    })
  }


  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every(status => status === true)) {
        const result = await this.stripService.createConfirmationToken();
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;

      }
    } catch (error: any) {
      this.snackBar.error(error.message);
    }

  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripAddress();
        address && await firstValueFrom(this.accountService.updateAddress(address));

      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripService.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripService.confirmPayment(this.confirmationToken);
        if (result.error) {
          throw new Error(result.error.message);
        } else {
          this.cartService.deleteCart();
          this.cartService.selectedDelivery.set(null);
          this.router.navigateByUrl('/checkout/success');

        }
      }

    } catch (error: any) {
      this.snackBar.error(error.message || 'something went wrong')

    } finally {
      this.loading = false;
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  private async getAddressFromStripAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;
    if (address) {
      return {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code
      }
    } else return null;
  }

}
