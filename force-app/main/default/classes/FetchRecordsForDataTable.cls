public with sharing class FetchRecordsForDataTable {
    public FetchRecordsForDataTable() {}

    @AuraEnabled(cacheable = true)
    public static List<Book__c> getSearchList(String book, String bookCategory, String authorName)
    {
        String booName = '%'+book+'%';
        try{
            list<Book__c> bookList = new list<Book__c> ();
             
            if(book != null && bookCategory == null && authorName == null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c WHERE
                    Book_Name__c LIKE: booName
                ];
            }
        
            if(book != null && bookCategory != null && authorName == null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c WHERE
                    Book_Name__c LIKE: booName AND Books_Category__r.Name =: bookCategory
                ];
            }

            if(book == null && bookCategory != null && authorName == null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c WHERE
                    Books_Category__r.Name =: bookCategory
                ];
            }

            if(book == null && bookCategory != null && authorName != null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c WHERE
                    Books_Category__r.Name =: bookCategory AND Author__r.Name =: authorName
                ];
            }

            if(book == null && bookCategory == null && authorName != null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c WHERE
                    Author__r.Name =: authorName
                ];
            }

            if(book != null && bookCategory == null && authorName != null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c WHERE
                    Book_Name__c LIKE: booName AND Author__r.Name =: authorName
                ];
            }

            if(book != null && bookCategory != null && authorName != null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c WHERE
                    Book_Name__c LIKE: booName AND Books_Category__r.Name =: bookCategory AND Author__r.Name =: authorName
                ];
            }
           
            if(book == null && bookCategory == null && authorName == null)
            {
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                    Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c
                ];
            }
            

            return bookList;
           } 
        catch (Exception e)
             {
                throw new AuraHandledException(e.getMessage());
             }
    }   
    @AuraEnabled(cacheable = true)
    public static List<Book__c> getBookList()
    {
        try{
            list<Book__c> bookList;           
                bookList = [
                    SELECT Id, Book_Name__c, Author__c, Author__r.Name, Books_Category__c, Books_Category__r.Name,
                                   Date_of_Publishing__c, Price__c, Description__c, Category__c FROM Book__c
                ];        

            return bookList;
           } 
        catch (Exception e)
             {
                throw new AuraHandledException(e.getMessage());
             }
    }   
    
    @AuraEnabled
    public static void deleteBookRecords(Id bookrecordId)
    {
        List<Book__c> bookList =  [SELECT Id, Book_Name__c from Book__c WHERE Id =: bookrecordId];
        system.debug(bookList);
        if(!bookList.isEmpty())
        {
            delete bookList;
        }
    }

    @AuraEnabled(cacheable = true)
    public static List<Book__c> getBooks(String bookCatName){
        try {
            List<Book__c> bookList = new List<Book__c> ();

            if(bookCatName != null)
            {
                bookList = [SELECT Id, Book_Name__c, Image_Url__c, Books_Category__c, Books_Category__r.Name, Author__c, Author__r.Name from Book__c WHERE Books_Category__r.Name =: bookCatName];
            }
            
            
            if(bookCatName == 'all')
            {           
                bookList = [SELECT Id, Book_Name__c, Image_Url__c, Books_Category__c, Books_Category__r.Name, Author__c, Author__r.Name, Price__c from Book__c];
            }

            if(!bookList.isEmpty())
            {
                for(Book__c bookI: bookList)
                {
                    system.debug(bookI.Id);
                    system.debug(bookI.Book_Name__c);
                }
            }else
            {
                System.debug('List is empty');
            }
            return bookList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static list<Book__c> getDefaultBooks(){
        try {
            List<Book__c> bookList = [SELECT Id, Book_Name__c, Image_Url__c, Books_Category__c, Books_Category__r.Name, Author__c, Author__r.Name, Price__c from Book__c];  
            return bookList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}