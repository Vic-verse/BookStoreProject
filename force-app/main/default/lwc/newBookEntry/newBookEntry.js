import { LightningElement, api, track, wire} from 'lwc';
import Book_OBJECT from '@salesforce/schema/Book__c';
import Book_NAME_FIELD from '@salesforce/schema/Book__c.Book_Name__c';
import Book_Catergory_FIELD from '@salesforce/schema/Book__c.Books_Category__c';
import Author_Name_FIELD from '@salesforce/schema/Book__c.Author__c';

import Book_Desc_FIELD from '@salesforce/schema/Book__c.Description__c';
import Category_FIELD from '@salesforce/schema/Book__c.Category__c';
import Book_Price_FIELD from '@salesforce/schema/Book__c.Price__c';
import Book_PubDate_FIELD from '@salesforce/schema/Book__c.Date_of_Publishing__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

import {subscribe, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';

export default class NewBookEntry extends LightningElement{
    
    @api bookObject = Book_OBJECT;
    editableRecordId;
    subscription = null;
    isVisible = true;

    myFields = [Book_NAME_FIELD, Book_Catergory_FIELD, Author_Name_FIELD, Book_Desc_FIELD,
        Category_FIELD, Book_Price_FIELD, Book_PubDate_FIELD
    ];
        

    @wire(MessageContext)
    messageContext;

    connectedCallback()
    { 
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
        this.editableRecordId = message.bookRecordId;
        this.isVisible = message.IsVisibleValue;
    }


    handleBookCreated(event){
        const evt = new ShowToastEvent({
            title: 'Record Inserted',
            message: 'Book record: ' + event.detail.fields.Book_Name__c.value + 'is successfully inserted',
            variant: 'success',
        })
        this.dispatchEvent(evt);
    }
    
}