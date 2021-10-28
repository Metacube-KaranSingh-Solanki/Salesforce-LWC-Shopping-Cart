import { LightningElement, api, track } from 'lwc';

export default class Cart extends LightningElement {
    @api cartProducts;
    @track errors = {};
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
        const rowId = event.detail.draftValues[0].Id
        const draftQuantity = parseInt(event.detail.draftValues[0].Quantity)
        const availableQuantity = this.cartProducts.filter(e => e.Id === rowId)[0].TempQuantity;

        if (draftQuantity <= 0 || draftQuantity > availableQuantity) {
            this.triggerError(rowId);
        } else if (draftQuantity > 0 && draftQuantity <= availableQuantity && this.errors.rows && this.errors.rows[rowId]) {
            this.removeRowError(rowId)
        }
    }

    removeRowError(rowId) {
        if (rowId) {
            delete this.errors.rows[rowId];
            if (this.errors.rows)
                this.errors = {}
        }
    }

    triggerError(rowId) {
        const _errors = {
            rows: {
                ...this.errors.rows,
                [rowId]: {
                    title: 'Quantity should be greater than zero or may not available',
                    messages: ['Enter a valid Quantity.'],
                    fieldNames: ['Quantity']
                }
            },
            table: {
                title: 'Your entry cannot be saved. Fix the errors and try again.',
                messages: ['Error on Quantity, Enter valid quantity']
            }
        };

        this.errors = _errors;
    }

    checkOut() {
        this.showInvoice = true;

        // Event to communicate with products component to hide products
        const invoiceStageReachedEvent = new CustomEvent("invoicestagereached");
        this.dispatchEvent(invoiceStageReachedEvent);
    }

    handleRowActions(event) {
        if (event.detail.action.Name === 'Delete') {
            let row = event.detail.row
            var loc = [...this.cartProducts];
            loc.splice(loc.findIndex(a => a.Id === row.Id), 1)
            this.cartProducts = loc
            this.dispatchEvent(new CustomEvent('remove', {
                detail: {
                    record: row,
                    selectedProducts: this.cartProducts
                }
            }))
        }
    }

    handleSave(event) {
        if (!this.errors.rows) {
            this.errors = {}

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
    }

    updateProducts() {
        this.dispatchEvent(new CustomEvent('update', {
            detail: {
                records: this.cartProducts
            }
        }))
    }
}