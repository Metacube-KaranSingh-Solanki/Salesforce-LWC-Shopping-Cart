import { LightningElement, api, track } from 'lwc';

export default class Cart extends LightningElement {
    @api cartProducts;
    @track errors;
    @track showInvoice = false;

    draftValues = [];

    productColumns = [
        { label: 'Name', fieldName: 'Name' },
        {
            label: 'Price',
            fieldName: 'Price',
            type: 'currency',
            typeAttributes: { currencyCode: 'EUR', step: '0.001' }
        },
        { label: 'Product Code', fieldName: 'ProductCode' },
        {
            label: 'Line Total',
            fieldName: 'LineTotal',
            type: 'currency',
            typeAttributes: { currencyCode: 'EUR', step: '0.001' }
        },
        { label: 'Quantity', fieldName: 'Quantity', editable: true },
        {
            label: 'Delete',
            type: 'button-icon',
            typeAttributes: {
                Name: 'Delete',
                iconName: 'utility:delete',
                variant: 'bare',
                alternativeText: 'Delete'
            },
        }
    ];

    handleOnCellChange(event) {
        let requestedQuantity = event.detail.draftValues[0].Quantity;
        let productId = event.detail.draftValues[0].Id;
        const theProduct = this.cartProducts.filter(element => element.Id == productId)[0];

        if (theProduct.TempQuantity < requestedQuantity) {
            alert('Not available');
        }
    }

    checkOut() {
        this.showInvoice = true;

        // Event to communicate with products component to hide products
        const invoiceStageReachedEvent = new CustomEvent("invoicestagereached");
        this.dispatchEvent(invoiceStageReachedEvent);
    }

    handleRowActions(event) {
        if (event.detail.action.Name === 'Delete') {
            var local = [...this.cartProducts];
            local.splice(local.findIndex(a => a.Id === event.detail.row.Id), 1)
            this.cartProducts = local
            this.deleteProduct(event.detail.row.Id, event.detail.row.TempQuantity);
        }
    }

    handleSave(event) {
        this.draftValues = event.detail.draftValues
        //Id, Quantity

        var cartProductsClone = JSON.parse(JSON.stringify(this.cartProducts));
        cartProductsClone.forEach(element => {
            var result = this.draftValues.filter(e => e.Id === element.Id)[0]
            if (result) {
                element.Quantity = result.Quantity
                element.AvailableQuantity = element.TempQuantity - element.Quantity
                element.LineTotal = element.Price * element.Quantity;
            }
        });

        this.cartProducts = cartProductsClone
        this.draftValues = []
        this.updateProducts()
    }

    updateProducts() {
        this.dispatchEvent(new CustomEvent('update', {
            detail: {
                records: this.cartProducts
            }
        }))
    }

    deleteProduct(productIdToDelete, totalQuantityOfProduct) {
        this.dispatchEvent(new CustomEvent('delete', {
            detail: {
                productId: productIdToDelete,
                totalQuantity: totalQuantityOfProduct
            }
        }))
    }
}