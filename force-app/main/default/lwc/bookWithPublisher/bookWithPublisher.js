import { LightningElement, wire, track, api } from 'lwc';
import getBookPublisher from '@salesforce/apex/bookPublisher.bookPub';
import { subscribe, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

const LATITUDE = 'Publisher__c.LatLong__Latitude__s';
const LONGITUDE = 'Publisher__c.LatLong__Longitude__s';

const publisherList = [LATITUDE, LONGITUDE];

export default class BookWithPublisher extends LightningElement {

    subscribtion = null;

    @track data;
    @track BookName;
    @track BookCat;
    @track BookAuth;
    @track BookPrice;
    @track bookId;
    @track error = null;
    @track recordId;
    mapMarkers = [];

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel()
    { 
        this.subscription = subscribe(
            this.messageContext,
            Search_File,
            (message) => this.handleMessage(message)
        );
    }
    
    handleMessage(message)
    { 
        this.bookId = message.BId;
        console.log('Book Id:'+ this.bookId);
    }

    @wire(getBookPublisher, { bookRecId: '$bookId' }) getBooks({error, data})
    {
        if (data) { 
            this.data = data;
        }
        else if (error)
        { 
            this.error = error;
            console.log(JSON.parse(JSON.stringify(this.error)));
            
        }       
    }

    @wire(getRecord, { recordId: '$bookId', fields: publisherList}) getPubLocations({error, data})
    {
        if (data) { 
            
            const Latitude = getFieldValue(data, LATITUDE);
            const Longitude = getFieldValue(data, LONGITUDE);

            this.mapMarkers = [{
                location: { Latitude, Longitude },
            }];

            console.log(JSON.parse(JSON.stringify(this.mapMarkers.location)));
        }
        else if (error)
        { 
            this.error = error;
            console.log(JSON.parse(JSON.stringify(this.error)));      
        }
       
    }
   

    // @wire(getBookPublisher) getBooks({error, data})
    // {
    //     if (data)
    //         this.data = data.map(details => Object.assign(
                
    //         ));
    //     }
    
    // }
}