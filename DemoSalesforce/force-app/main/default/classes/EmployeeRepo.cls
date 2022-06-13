public with sharing class EmployeeRepo {

    /**
     * Get all employee in db
     */
    public List<Employee__c> getEmployeeList(){
        String sql = 'SELECT Id, Name, Email__c, Phone__c, Birthday__c, SrcAvatar__c, LastModifiedDate, Memo__c';
        sql += ' FROM Employee__c ORDER BY Name';
        return Database.query(sql);
    }

    /**
     * Get list employees with phone number and name enterd
     */
    public List<Employee__c> searchEmployeeList(String name, String phone){
        String sql = 
        'SELECT Id, Name, Email__c, Phone__c, Birthday__c , SrcAvatar__c, LastModifiedDate, Memo__c ';
        sql+=  ' FROM Employee__c';
        sql+=  ' WHERE Id != null ';
        if(String.isNotBlank(name)) {
            String nameSearch = '%' + name + '%';
            sql += 'AND Name LIKE :nameSearch' ;
        }
        if(String.isNotBlank(phone)) {
            String phoneSearch = '%' + phone + '%';
            sql += ' AND Phone__c LIKE :phoneSearch';
        }
        sql+=  ' ORDER BY Name';
        return Database.query(sql);
    }
    
    /**
     * Get LastModifiedDate 
     */
    public Employee__c getLastModifiedDate(String employeeId){
        return [
            SELECT LastModifiedDate
            FROM Employee__c
            WHERE Id = :employeeId
        ];
    }

    /**
     * Check employee exist in db or not
     */
    public List<Employee__c> checkEmployeeExists(String employeeId){
        return [
            SELECT Id, LastModifiedDate
            FROM Employee__c
            WHERE Id = :employeeId
        ];
    }

    /**
     * Get detail of employee by Id
     */
    public Employee__c getDetailEmployeeById(String employeeId) {
        return [
            SELECT Id, Name, Email__c, Phone__c, BirthDay__c, Memo__c, LastModifiedDate, SrcAvatar__c
            FROM Employee__c 
            WHERE Id = :employeeId
        ];
    }




   

    
}