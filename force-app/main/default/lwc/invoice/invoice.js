import { LightningElement, api, track } from 'lwc';
import placeOrder from '@salesforce/apex/ShoppingCartController.placeOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Invoice extends LightningElement {

    @api invoiceProducts;
    @track orderPlaced = false;

    productColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Product Code', fieldName: 'ProductCode' },
        { label: 'Quantity', fieldName: 'Quantity' },
        {
            label: 'Price',
            fieldName: 'Price',
            type: 'currency',
            typeAttributes: { currencyCode: 'EUR', step: '0.001' }
        },
    ];

    placeOrder() {
        placeOrder({
            productsString: JSON.stringify(this.invoiceProducts)
        })
            .then(result => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Congratulations!',
                    message: 'Your order was placed successfully.',
                    variant: 'success'
                }));
                this.orderPlaced = true;
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!',
                    message: 'Unable to place your order at this time.',
                    variant: 'error'
                }));
            })
    }

    backToOrders() {
        eval("$A.get('e.force:refreshView').fire();");
    }
}