public with sharing class EmployeeLogic {
    private static EmployeeRepo employeeRepo = new EmployeeRepo();

    /**
     * Get all employee in db
     */
    public String getEmployeeList() {
        Map<String, Object> result = new Map<String, Object>();
        List<Employee__c> employees = employeeRepo.getEmployeeList();
        result.put('employees', employees);
        return JSON.serialize(result); 
    }

    /**
     * Search  all employees  with name and phone entered
     */
    public String searchEmployeeList(String name, String phone) {
        Map<String, Object> result = new Map<String, Object>();
        List<Employee__c> employees = employeeRepo.searchEmployeeList(name, phone);
        result.put('employees', employees);
        return JSON.serialize(result); 
    }

    /**
     * Add or insert an employee
     */
    public String upsertEmployee(EmployeeDto model){
        // Create map save message
        Map<String, Object> result = new Map<String, Object>();
        // Create and report employee obj
        Employee__c employeeObj = new Employee__c();

        if(model.Id != ''){
            // Check employee's records
            List<Employee__c> getEmployeeById = employeeRepo.checkEmployeeExists(model.Id);
            if(getEmployeeById.size() == 0) {
                // Notice when update a employee is not exist
                result.put('title', 'Error!');
                result.put('message', 'Employee is not exist!');
                result.put('variant', 'error');
                return JSON.serialize(result);
            }
            // validate modified date
            String lastModifiedDate = getEmployeeById[0].LastModifiedDate.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss');
            if(lastModifiedDate != model.LastModifiedDate) {
                result.put('title', 'Error!');
                result.put('message', 'Employee is out of date. Please refresh page again.');
                result.put('variant', 'error');
                result.put('lastModifiedDate', lastModifiedDate);
                
                return JSON.serialize(result);
            }           
            employeeObj.Id = model.Id;

        }
        employeeObj.Name = model.Name;
        employeeObj.Email__c = model.Email;
        employeeObj.Phone__c = model.Phone;
        employeeObj.Birthday__c = model.Birthday;
        employeeObj.Memo__c = model.Memo;
        employeeObj.SrcAvatar__c = model.SrcAvatar;

        // save to DB
        upsert employeeObj;


        // Notice when insert or update passed
        result.put('title', 'Success!');
        result.put('message', 'Employee is saved successfully!');
        result.put('variant', 'success');
        result.put('empid', employeeObj.Id);
        result.put('lastModifiedDate', employeeRepo.getLastModifiedDate(employeeObj.Id));
        return JSON.serialize(result);
    }


    /**
     * Get detail employee by id
     */
    public Employee__c getDetailEmployeeById(String employeeId) {
        return employeeRepo.getDetailEmployeeById(employeeId);
    }


    /**
     * Delete Employee
     * employeeId : employeeId
     */
    public String deleteEmployee(String employeeId) {
        Map<String, Object> result = new Map<String, Object>();
        List<Employee__c> employeeObj = employeeRepo.checkEmployeeExists(employeeId);
        if(employeeObj.size() == 0) {
            // Notice when update a employee is not exist
                result.put('title', 'Error!');
                result.put('message', 'Employee is not exist!');
                result.put('variant', 'error');
        } else {
            delete(employeeObj);
            result.put('title', 'Success!');
            result.put('message', 'Employee is deleted successfully!');
            result.put('variant', 'success');
        }
        return JSON.serialize(result);
    }
}