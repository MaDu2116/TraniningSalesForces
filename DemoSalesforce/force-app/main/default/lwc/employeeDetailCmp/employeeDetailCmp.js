import { api, LightningElement, track } from 'lwc';

export default class EmployeeDetailCmp extends LightningElement {
    @api employee;


    get isHasRecord() {
        if (this.employee != undefined && this.employee.Id != undefined) {
            return true;
        }
        else return false;
    }


}