import { LightningElement, wire, track } from 'lwc';

import searchProductsByKey from '@salesforce/apex/ShoppingCartController.searchProductsByKey';

export default class Products extends LightningElement {

    visibleProducts;

    @track searchKey = '';
    @track selectedProducts;
    @track invoiceStage = false;    // This will be set by event from invoice component

    productColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Product Code', fieldName: 'ProductCode' },
        {
            label: 'Price',
            fieldName: 'Price__c',
            type: 'currency',
            typeAttributes: { currencyCode: 'EUR', step: '0.001' }
        },
        { label: 'Quantity', fieldName: 'AvailableQuantity__c' }
    ];

    @wire(searchProductsByKey, { key: '$searchKey' }) products;

    searchProducts(event) {
        this.searchKey = event.detail.value;
    }

    addToCart() {
        let tempSelected = Array.from(this.template.querySelector('lightning-datatable').getSelectedRows(), obj => new Object({
            Id: obj.Id,
            Name: obj.Name,
            Quantity: 1,
            ProductCode: obj.ProductCode,
            AvailableQuantity: obj.AvailableQuantity__c - 1,
            Price: obj.Price__c,
            LineTotal: obj.Price__c,
            TempQuantity: obj.AvailableQuantity__c
        }))

        if (this.selectedProducts) {
            let temp1 = [...this.selectedProducts]
            temp1.forEach(element => {
                var result = tempSelected.filter(e => e.Id === element.Id)[0]
                console.log(result)
                if (result) {
                    result.Quantity += 1
                    result.AvailableQuantity__c = element.AvailableQuantity__c - 1
                } else {
                    tempSelected.push(element);
                }

            })
            console.log(tempSelected)
            this.selectedProducts = tempSelected
            //total order update
            let temp = JSON.parse(JSON.stringify(this.products.data))
            temp.forEach(element => {
                var result = this.selectedProducts.filter(e => e.Id === element.Id)[0]
                if (result) {
                    element.AvailableQuantity__c = result.AvailableQuantity
                }
            })
            this.products.data = temp

        } else {
            this.selectedProducts = tempSelected
            this.isShowCart = true
            let temp = JSON.parse(JSON.stringify(this.products.data))
            temp.forEach(element => {
                var result = this.selectedProducts.filter(e => e.Id === element.Id)[0]
                if (result) {
                    element.AvailableQuantity__c = result.AvailableQuantity
                }
            })
            this.products.data = temp

        }
    }

    activateInvoiceStage() {
        this.invoiceStage = true;
    }

    updateProductHandler(event) {
        this.visibleProducts = [...event.detail.records];
    }

    updateHandler(event) {
        this.selectedProducts = [...event.detail.records]
        let clone = JSON.parse(JSON.stringify(this.products.data))

        clone.forEach(element => {
            var result = this.selectedProducts.filter(e => e.Id === element.Id)[0]
            if (result) {
                element.AvailableQuantity__c = result.AvailableQuantity
            }
        })
        this.products.data = clone
    }

    deleteHandler(event) {
        let clone = JSON.parse(JSON.stringify(this.products.data))
        clone.forEach(element => {
            if (element.Id == event.detail.productId) {
                //alert(JSON.stringify(event.detail.totalQuantity));
                //console.log('AQ Before:', element.AvailableQuantity__c, element.Name);
                element.AvailableQuantity__c = event.detail.totalQuantity;
                //console.log('AQ After:', element.AvailableQuantity__c, element.Name);
            }
        })
        this.products = [];
        this.products.data = clone;
        console.log(JSON.stringify(this.products.data));
    }
}