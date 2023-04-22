public class bookPublisher {

    @AuraEnabled(cacheable =true)
    public static list<Book_Publisher__c> bookPub(Id bookRecId)
    {
        list<Book_Publisher__c> bookPublisherList = new list<Book_Publisher__c>();
        
        if(bookRecId != null)
        {        
            bookPublisherList = [SELECT Id, Book__c, Book__r.Book_Name__c, Book__r.Author__r.Name, Book__r.Books_Category__r.Name,
            Book__r.Date_of_Publishing__c, Book__r.Price__c, Book__r.Image_Url__c, Publisher__c, Publisher__r.Name, Publisher__r.LatLong__Latitude__s, 
            Publisher__r.LatLong__Longitude__s, Publisher__r.LatLong__c, Publisher__r.Address__c FROM Book_Publisher__c where book__c =: bookRecId];
            
            for(Book_Publisher__c bp: bookPublisherList)
            {
                System.debug(bp.Id);
                System.debug('Book Id: '+ bp.Book__c);
                System.debug('Book: '+bp.Book__r.Book_Name__c);
                System.debug('Book Author: '+bp.Book__r.Author__c);
                System.debug('Cat: '+ bp.Book__r.Books_Category__c);
                System.debug('DOP: '+ bp.Book__r.Date_of_Publishing__c);
                System.debug('price: '+bp.Book__r.Price__c);
                System.debug('Image: '+bp.Book__r.Image_Url__c);
                System.debug('Publisher: '+ bp.Publisher__c);
                System.debug('Pub Name: '+ bp.Publisher__r.Name);
            }
        }
        
        else{System.debug('List is empty');}
       
        return bookPublisherList;
    }
}