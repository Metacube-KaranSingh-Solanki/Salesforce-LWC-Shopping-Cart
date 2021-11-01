import { LightningElement, wire, track } from 'lwc';
import getPurchaseOrders from '@salesforce/apex/ShoppingCartController.getPurchaseOrders';

export default class PurchaseOrder extends LightningElement {
    @track showProduct = false;

    @wire(getPurchaseOrders) orders;

    orderColumns = [
        { label: 'PO Id', fieldName: 'Name' },
        { label: 'Status', fieldName: 'Status__c' },
        {
            label: 'Order Total',
            fieldName: 'OrderTotal__c',
            type: 'currency',
            typeAttributes: { currencyCode: 'EUR', step: '0.001' },
        }
    ];

    showProducts() {
        this.showProduct = true;
    }
}