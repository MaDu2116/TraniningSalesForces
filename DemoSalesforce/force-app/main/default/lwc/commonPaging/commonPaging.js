import { api, LightningElement, track } from 'lwc';

export default class CommonPaging extends LightningElement {
    @api totalRecord;
    @track itemPerPage = 2;
    @api currentPage;
    @api totalPage;

    @track optionItemPerPage = ['2', '5', '10', '20', '40'];

    /**
     * Change item per page 
     * @param {*} event 
     */
    changeItemPerPageHandler(event) {
        this.itemPerPage = event.target.value;
        //Khi thay đổi show item per page thì hiển thị về paging 1 (vẫn giữ lại record bên detail)
        this.currentPage = 1;
        this.dispatchEvent(new CustomEvent('paging', { detail: { itemPerPage: this.itemPerPage, currentPage: this.currentPage } }));
    }

    /**
     * Get total page
     */
    get getTotalPage() {
        this.totalPage = Math.ceil(this.totalRecord / this.itemPerPage);
        return this.totalPage;
    }

    /**
     * Handle when click button next
     * @param {*} event 
     */
    nextHandler(event) {
        if (this.currentPage < this.totalPage) {
            this.currentPage++;
        }
        this.dispatchEvent(new CustomEvent('paging', { detail: { itemPerPage: this.itemPerPage, currentPage: this.currentPage } }));
    }

    /**
     * Hander when click button previous
     */
    previousHandler() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
        this.dispatchEvent(new CustomEvent('paging', { detail: { itemPerPage: this.itemPerPage, currentPage: this.currentPage } }));
    }
    /**
     * disable button Previous when current page = 1
     */
    get getPreviousCssClass() {
        return (this.currentPage == 1) ? 'paging-item unactive-item' : 'paging-item';
    }

    /**
     * disable button Next when current page = 1
     */
    get getNextCssClass() {
        return (this.currentPage == this.totalPage) ? 'paging-item unactive-item' : 'paging-item';
    }



}