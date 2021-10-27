import { LightningElement, api } from 'lwc';

export default class Pagination extends LightningElement {

    totalRecords;
    @api recordSize = 5;
    currentPage = 1;
    totalPages;

    get records() {
        return this.visibleRecords;
    }
    @api
    set records(data) {
        if (data) {
            this.totalRecords = data;
            this.recordSize = Number(this.recordSize);
            this.totalPages = Math.ceil(data.length / this.recordSize);
            this.updateRecords();
        }
    }

    nextHandler() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateRecords()
        }
    }

    previousHandler() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateRecords();
        }
    }

    updateRecords() {
        const start = (this.currentPage - 1) * this.recordSize;
        const end = this.currentPage * this.recordSize;
        this.visibleRecords = this.totalRecords.slice(start, end);

        this.dispatchEvent(new CustomEvent("update", {
            detail: {
                records: this.visibleRecords
            }
        }))
    }

    get disableNext() {
        return this.currentPage == this.totalPages;
    }

    get disablePrevious() {
        return this.currentPage == 1;
    }
}