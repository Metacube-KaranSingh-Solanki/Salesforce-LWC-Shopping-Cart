import { LightningElement, api } from 'lwc';

export default class Pagination extends LightningElement {

    totalRecords;
    currentPage = 1;
    totalPages;

    @api recordSize = 10;
    @api
    get records() {
        return this.visibleRecords;
    }
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

        this.dispatchEvent(new CustomEvent("updatepage", {
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