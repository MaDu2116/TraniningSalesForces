import { LightningElement, track } from 'lwc';

export default class EmployeePage extends LightningElement {

    @track dataEdit = {
        isShow: false,
        employee: {},
        checked: false
    }
    @track dataDetail = {
        isHasRecord: false,
        employee: {},
        
    };
    
    @track employeedetail;
    openModalEditEmployee(event) {
        this.dataEdit.employee = JSON.parse(event.detail.employees);
        this.dataEdit.checked = event.detail.checked;
        this.dataEdit.isShow = true;
    }
    
    renderedCallback() {
        console.log('Component was rendered!')
    }

    /**
     * Save Employee
     */
    savedEmployee() {
        this.template.querySelector('c-employee-list-cmp').handleDispatchDetailEmployees();
    }

    /**
     * Save Employee to list
     * @param {*} event 
     */
    savedEmpTolist(event) {
        this.template.querySelector('c-employee-list-cmp').handleUpsertEmployee(event.detail);
    }

    /**
     * Close Modal Edit employee
     */
    closeModalEditEmployee(event) {
        this.dataEdit.isShow = false;
    }

    /**
     * 
     * @param {*} event 
     */
    handleShowDetailEmployee(event){
        this.dataDetail.employee = event.detail;
    }
}