public with sharing class EmployeeDto {
    @AuraEnabled
    public String Id { get; set; }
    @AuraEnabled
    public String Email { get; set; }
    @AuraEnabled
    public String Name { get; set; }
    @AuraEnabled
    public String Memo { get; set; }
    @AuraEnabled
    public Date Birthday { get; set; }
    @AuraEnabled
    public String Phone { get; set; }
    @AuraEnabled
    public String LastModifiedDate { get; set; }
    @AuraEnabled
    public String SrcAvatar { get; set; }
}