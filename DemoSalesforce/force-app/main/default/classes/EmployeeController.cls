public with sharing class EmployeeController {

    private static EmployeeLogic employeeLogic = new EmployeeLogic();

   @AuraEnabled(cacheable=true)
   public static String getEmployeeList(){
       try {
            return employeeLogic.getEmployeeList();
       } catch (Exception e) {
            return EmployeeUtil.returnErrorJsonFormat(e.getMessage());
       }
   }

   @AuraEnabled
   public static String searchEmployeeList(String name, String phone){
       try {
            return employeeLogic.searchEmployeeList( name,  phone);
       } catch (Exception e) {
            return EmployeeUtil.returnErrorJsonFormat(e.getMessage());
       }
   }

   @AuraEnabled
    public static String doUpsertEmployee(EmployeeDto model) {
        try {
            return employeeLogic.upsertEmployee(model);
        } catch (Exception ex) {
            return EmployeeUtil.returnErrorJsonFormat(ex.getMessage());
        }
    }
    
    @AuraEnabled
    public static Employee__c doDetailEmployeeById(String employeeId) {
            return employeeLogic.getDetailEmployeeById(employeeId);
    
    }
   

    @AuraEnabled
    public static String deleteEmployee(String employeeId){
        try {
            return employeeLogic.deleteEmployee(employeeId);
        } catch (Exception ex) {
            return EmployeeUtil.returnErrorJsonFormat(ex.getMessage());
        }
    }
}