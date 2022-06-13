import { api, LightningElement, track, wire } from 'lwc';
import getEmployeeList from '@salesforce/apex/EmployeeController.getEmployeeList';
import searchEmployeeList from '@salesforce/apex/EmployeeController.searchEmployeeList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import doDetailEmployeeById from '@salesforce/apex/EmployeeController.doDetailEmployeeById';
import deleteEmployee from '@salesforce/apex/EmployeeController.deleteEmployee';

export default class EmployeeListCmp extends LightningElement {
    @track displayingEmployees = [];
    getIsShowNotHasRecord = false;
    error;
    @track employees = {};
    @track isSearching = false;
    @track searchInput = {
        name: '',
        phone: ''
    }
    @track msg = '';
    @track itemPerPage = 2;
    @track totalRecord;
    @track currentPage = 1;
    @track employeeId;
    @track isRefreshing = false;
    @track checkEmployee = false;

    /**
     *  handle show list employee 
     * @param {*} param0 
     */
    @wire(getEmployeeList)
    wriedEmployeeList({ error, data }) {
        if (data) {
            let employeeData = JSON.parse(data);
            this.totalRecord = employeeData.employees.length;
            if (this.totalRecord > 0) {
                let employeeData = JSON.parse(data);
                this.convertJsonToListEmployee(employeeData.employees);
                this.displayEmployees();
                this.getIsShowNotHasRecord = false;
            }
            else {
                this.displayingEmployees = undefined;
                this.getIsShowNotHasRecord = true;
            }
        } else if (error) {
            this.displayingEmployees = undefined;
            this.getIsShowNotHasRecord = true;
        }
    };

    /**
     * Handling display employees
     */
    displayEmployees() {

        this.displayingEmployees = this.employees;
        this.totalRecord = this.employees.length;
        let startRecord = (this.currentPage - 1) * this.itemPerPage + 1;

        let endRecord = this.currentPage * this.itemPerPage;
        if (endRecord > this.totalRecord) {
            endRecord = this.totalRecord;
        }
        this.displayingEmployees = [];
        for (let i = startRecord; i <= endRecord; i++) {
            this.displayingEmployees.push(this.employees[i - 1]);
        }
    }
    /**
     * Convert JSON to List and add No into employee -> List employee
     */
    convertJsonToListEmployee(empData) {
        let employeeData = [];
        empData.forEach((emp, index) => {
            var objectEmployee = {
                ...emp,
                No: index + 1,
                isSelect: false
            }
            employeeData.push(objectEmployee);
        });
        this.employees = employeeData;
    }

    /**
     * handleChangeSearchInput
     * @param {*} event 
     */
    handleChangeSearchInput(event) {
        this.searchInput[event.currentTarget.dataset.searchName] = event.target.value;
    }

    /**
     * Control hidden/show icon searching
     */
    get getVisibilityIconSearching() {
        return (this.isSearching) ? 'icon-searching' : 'icon-searching hidden-loading';
    }

    /**
     * handle search
     */
    handleSearchEmployees() {
        searchEmployeeList({ name: this.searchInput['name'], phone: this.searchInput['phone'] })
            .then((data) => {
                let employeeData = JSON.parse(data);
                this.totalRecord = employeeData.employees.length;
                if (this.totalRecord > 0) {
                    this.currentPage = 1;
                    this.convertJsonToListEmployee(employeeData.employees);
                    this.displayEmployees();
                    this.getIsShowNotHasRecord = false;
                    this.showToast('Search data was successfully');
                } else {
                    this.displayingEmployees = undefined;
                    this.getIsShowNotHasRecord = true;
                    this.itemPerPage = 2;
                }
            }).catch((error) => {
                this.displayingEmployees = undefined;
                this.getIsShowNotHasRecord = true;
            })
    }
    /**
     * The showToast function creates and dispatches the event. 
     * An info toast displays in Lightning Experience for 3 seconds or until the user clicks to close it.
     * https://developer.salesforce.com/docs/component-library/bundle/lightning-platform-show-toast-event/documentation
     */
    showToast(msg) {
        const event = new ShowToastEvent({
            // title: 'Message',
            message: msg,
            variant: 'success'
        });
        this.dispatchEvent(event);
    }

    /**
     * Get total record
     */
    get getTotalRecord() {
        if (this.employees) {
            this.totalRecord = this.employees.length;
            return this.totalRecord;
        }
    }

    /**
     * handle paging event
     * @param {*} event 
     */
    handlePagingEvent(event) {
        this.itemPerPage = event.detail.itemPerPage;
        this.currentPage = event.detail.currentPage;
        this.displayEmployees();
    }


    /**
    * Handle refresh page
    * Refresh page: Update lại dữ liệu mới nhất của record, giữ nguyên paging, search condition				
    * TH currentPage > maxPage thì đưa về trang 1. 				
    */
    handleRefreshPage() {

        this.isRefreshing = true;
        searchEmployeeList({ name: this.searchInput['name'], phone: this.searchInput['phone'] })
            .then((data) => {
                let employeeData = JSON.parse(data);
                let totalRecordNew = employeeData.employees.length;
                if (totalRecordNew > 0) {
                    let maxPage = this.caculateMaxPage(totalRecordNew);

                    //TH currentPage > maxPage thì đưa về trang 1.
                    if (this.currentPage > maxPage) {
                        this.currentPage = 1;
                    };
                    this.convertJsonToListEmployee(employeeData.employees);
                    this.displayEmployees();
                    this.getIsShowNotHasRecord = false;
                    this.showToast('Refresh page was successfully');
                } else {
                    this.displayingEmployees = undefined;
                    this.getIsShowNotHasRecord = true;
                }
                this.isRefreshing = false;
            }).catch((error) => {
                this.displayingEmployees = undefined;
                this.getIsShowNotHasRecord = true;
                this.isRefreshing = false;
            })
    }


    /**
     * Caculate number of maximum page
     * @param {*} totalRecord 
     * @returns 
     */
    caculateMaxPage(totalRecord) {
        return Math.ceil(totalRecord / this.itemPerPage);
    }


    /**
     * Handle add or edit Employee
     */
    handleOpenModalUpsertEmployee(event) {
        let employeeId = event.target.dataset.id;
        let check = false;

        let employee = {};
        if (employeeId != undefined) {
            check = this.template.querySelector(`[data-id="${employeeId}"]`).checked;
            employee = this.findEmployeeById(employeeId);
        }
        this.dispatchEvent(new CustomEvent('openmodalupsertemployee', { detail: { employees: JSON.stringify(employee), checked: check } }));
    }


    /**
     * Find employee by ID
     * @param {*} employeeId 
     * @returns employee
     */
    findEmployeeById(employeeId) {
        if (this.employees.length > 0) {
            return this.employees.find(emp => emp.Id == employeeId);
        }
    }


    /**
     * Handling the display of changed records after adding or editing
    */
    @api
    handleUpsertEmployee(employee) {
        let empTemp = this.findEmployeeById(employee.Id);
        if (empTemp === undefined) {
            let addedEmp = {
                ...employee,
                No: '-',
                isSelected: false
            }
            console.log(addedEmp);
            //Reset value in the field does not any record any
            if (this.displayingEmployees === undefined) {
                this.displayingEmployees = [];
                this.employees = [];
            }
            this.displayingEmployees.push(addedEmp);
            this.employees.push(addedEmp);
            this.getIsShowNotHasRecord = false;

        } else {
            let index = this.findIndexEmployeeFromListDisplay(employee.Id);
            this.displayingEmployees[index] = employee;
            let index1 = this.findIndexEmployeeFromListAll(employee.Id);
            this.employees[index1] = employee;
        }
    }

    /**
     * 
     * Find index Employee from list employees on display
     * @param {*} employeeId  
     * @returns  index
     */
    findIndexEmployeeFromListDisplay(employeeId) {
        let index = 0;
        for (let i = 0; i < this.displayingEmployees.length; i++) {
            if (this.displayingEmployees[i].Id === employeeId) {
                index = i;
            }
        }
        return index;
    }
    /**
     * findIndexEmployeeFromListAll
     * @param {*} employeeId 
     * @returns 
     */
    findIndexEmployeeFromListAll(employeeId) {
        let index = 0;
        for (let i = 0; i < this.employees.length; i++) {
            if (this.employees[i].Id === employeeId) {
                index = i;
            }
        }
        return index;
    }


    /**
     * Handle selected detail
     */
    handleSelectedDetail(event) {
        this.idEmployee = event.target.dataset.id;
        this.employeeNo = event.target.dataset.no;

        this.handleDispatchDetailEmployees();
    }

    //Get and set employee searched through EmployeeId
    @api
    handleDispatchDetailEmployees() {
        doDetailEmployeeById({ employeeId: this.idEmployee })
            .then((result) => {
                let objEmp = {
                    ...result,
                    No: this.employeeNo
                }
                this.employeeDetail = objEmp;
                this.error = undefined;
                for (let i = 0; i < this.employees.length; i++) {
                    if (this.employees[i].Id == this.idEmployee) {
                        this.employees[i].isSelected = true;
                    } else {
                        this.employees[i].isSelected = false;
                    }
                }
                // Initialize and dispatch `id employee` to display the `detail employee`
                this.dispatchEvent(new CustomEvent('getdetail', { detail: this.employeeDetail }));

            })
            .catch((error) => {
                this.employeeDetail = undefined;
                this.error = error;
            });

    }

    /**
     * Handle delete employee
     */
    handleDeleteEmployee(event) {
        let employeeId = event.target.dataset.id;
        let employeeName = event.target.dataset.name;
        let confirmDelete = window.confirm('Do you want to delete employee: [' + employeeName + ']');
        this.checkEmployee = this.template.querySelector(`[data-id="${employeeId}"]`).checked;
        if (confirmDelete) {


            deleteEmployee({ employeeId: employeeId })
                .then((result) => {
                    let msg = JSON.parse(result);
                    const event = new ShowToastEvent({
                        "title": msg.title,
                        "message": msg.message,
                        variant: msg.variant
                    });

                    // Show changes of employee to Detail component when delete pass
                    if (msg.variant == 'success') {
                        if (this.checkEmployee) {
                            this.dispatchEvent(new CustomEvent('getdetail', { detail: undefined }));
                        }
                        this.handleDisplayDeleteEmployee(employeeId);
                    }
                    this.dispatchEvent(event);

                }).catch((error) => {
                    const event = new ShowToastEvent({
                        "title": 'Error!',
                        "message": 'System error. Please reload page.',
                        variant: 'error'
                    });
                    this.dispatchEvent(event);
                });
        }
    }

    // Display the list again after delete items
    handleDisplayDeleteEmployee(employeeId) {
        let employee = this.findEmployeeById(employeeId);
        if (employee.No === '-') {
            let index = this.findIndexEmployeeFromListDisplay(employeeId);
            this.displayingEmployees.splice(index, 1);
            let index1 = this.findIndexEmployeeFromListAll(employeeId);
            this.employees.splice(index1, 1);
        } else {
            let index = this.findIndexEmployeeFromListDisplay(employeeId);
            this.displayingEmployees.splice(index, 1);
            let index1 = this.findIndexEmployeeFromListAll(employeeId);
            this.employees.splice(index1, 1);
            if (this.displayingEmployees.length == 0) {
                // this.totalRecord--;
                this.currentPage--;
            }
            this.displayEmployees();
            if (this.totalRecord > 1) {
                this.totalRecord--;
            } else if (this.totalRecord == 0) {
                this.displayingEmployees = undefined;
                this.getIsShowNotHasRecord = true;
                this.itemPerPage = 2;
            }
        }
    }

}