public with sharing class fetchBookCategoryData {
    public fetchBookCategoryData() {

    }

    @AuraEnabled(cacheable=true)
    public static list<Books_Category__c> bCatlist(){
        try {
            return [SELECT Id, Name FROM Books_Category__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}