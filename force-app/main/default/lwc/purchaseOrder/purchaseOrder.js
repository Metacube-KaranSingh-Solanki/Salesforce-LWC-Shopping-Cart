import { LightningElement, wire, track } from 'lwc';

import getOrders from '@salesforce/apex/ShoppingCartController.getOrders';

export default class PurchaseOrder extends LightningElement {
    @track showProduct = false;

    @wire(getOrders) orders;

    orderColumns = [
        { label: 'PO Id', fieldName: 'Name' },
        { label: 'Status', fieldName: 'Status__c' },
        { label: 'Order Total', fieldName: 'OrderTotal__c' }
    ];

    showProducts() {
        this.showProduct = true;
    }
}