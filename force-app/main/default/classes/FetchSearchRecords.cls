public class FetchSearchRecords {
   
    //  @AuraEnabled(cacheable = true)
    //    public static list<Book__c> fetchBook(){
    //  try
    //  {
    //     return  [SELECT Id, Book_Name__c FROM Book__c];
    //  } catch (Exception e) 
    //    {
    //     throw new AuraHandledException(e.getMessage());
    //    }
    // }

    @AuraEnabled(cacheable = true)
    public static list<Books_Category__c> fetchBookCatData(){
        try
        {
            List<Books_Category__c> bookcatList = [ SELECT Id, Name FROM Books_Category__c ];
    
            return bookcatList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static list<Author__c> fetchAuthData(){
        try {
            List<Author__c> authList = [ SELECT Id, Name FROM Author__c ];
            return authList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}