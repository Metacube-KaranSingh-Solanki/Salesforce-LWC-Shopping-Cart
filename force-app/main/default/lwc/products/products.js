import { LightningElement, wire, track } from 'lwc';
import searchProductsByKey from '@salesforce/apex/ShoppingCartController.searchProductsByKey';

export default class Products extends LightningElement {

    visibleProducts;                // This will be set by pagination child component (updatepage event)

    @track searchKey = '';
    @track selectedProducts;
    @track invoiceStage = false;    // This will be set by invoice child component (invoicestagereached event)

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

        // To send only those products whose quantity is available (>=0)
        tempSelected = tempSelected.filter(ev => {
            if (ev.AvailableQuantity >= 0) {
                return true
            }
        })

        if (this.selectedProducts && this.selectedProducts.length > 0) {
            let tempClone = [...this.selectedProducts]
            tempSelected = tempClone.concat(tempSelected) // Duplicate values present
            var selectedClone = []
            tempSelected.forEach(element => {
                let countDuplicates = tempSelected.filter(ev => element.Id == ev.Id) // Count of duplicates
                let isPresent = selectedClone.some(ev => element.Id == ev.Id)

                if (countDuplicates.length > 1 && !isPresent) {
                    element.Quantity = countDuplicates[0].Quantity + countDuplicates[1].Quantity;
                    element.AvailableQuantity = element.TempQuantity - element.Quantity
                    element.LineTotal = element.Quantity * element.Price
                    selectedClone.push(element)
                } else if (countDuplicates.length == 1 && !isPresent) {
                    selectedClone.push(element)
                }

            })
            this.selectedProducts = selectedClone
            this.updateTotalOrder()

        } else if (tempSelected.length > 0) {
            this.selectedProducts = tempSelected
            this.updateTotalOrder()
        }
    }

    activateInvoiceStage() {
        this.invoiceStage = true;
    }

    updatePageHandler(event) {
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

    removeHandler(event) {
        var row = event.detail.record
        this.selectedProducts = event.detail.selectedProducts

        let temp = [...this.products.data]
        temp.forEach(element => {
            if (element.Id === row.Id) {
                element.AvailableQuantity__c = row.TempQuantity
                return;
            }
        })
        this.products = []
        this.products.data = temp
    }

    updateTotalOrder() {
        let clone = JSON.parse(JSON.stringify(this.products.data))
        clone.forEach(element => {
            var result = this.selectedProducts.filter(e => e.Id === element.Id)[0]
            if (result) {
                element.AvailableQuantity__c = result.AvailableQuantity
            }
        })
        this.products.data = clone
    }
}