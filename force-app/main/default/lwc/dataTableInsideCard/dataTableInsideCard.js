import { LightningElement, track, wire, api } from 'lwc'; 
import BookRecords from '@salesforce/apex/FetchRecordsForDataTable.getBooks';
import Book from '@salesforce/apex/FetchRecordsForDataTable.getDefaultBooks';
import {publish, subscribe, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
export default class DataTableInsideCard extends LightningElement {

    subscription = null;

    @track data;
    @track error = null;
    @track endingRecord = 0;
    @track startingRecord = 1;
    @track page = 1;
    @track totalRecords;
    @track pageSize = 12;
    @track totalPages;
    @track isPrev = false;
    @track isNext = false;
    @track bookCategoryName;
    @track bookDetails;
    @wire(MessageContext)
    messageContext;


    connectedCallback()
    {
        this.subscribeToMessageChannel();

        Book().then(result => {
            this.data = result;

            this.items = this.data;
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.data = this.items.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
        })
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
        this.bookCategoryName = message.BookCat;
        console.log('Book Category: '+this.bookCategoryName);    
    }

    @wire(BookRecords, { bookCatName: '$bookCategoryName' }) getBooks({error, data})
    {
        if (data) { 
            this.data = data;
            
        this.items = this.data;
        this.totalRecords = this.data.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.data = this.items.slice(0, this.pageSize);
        this.endingRecord = this.pageSize;
        }
        else if (error)
        { 
            this.error = error;
            console.log(JSON.parse(JSON.stringify(this.error)));
            
        }
        
       
    }

    handleBook(event)
    { 
        const id = event.target.dataset.link;
        console.log('Clicked:', id);
        const payload = { BId: id };
        publish(this.messageContext, Search_File, payload);
    }

    handlePagePrevAction()
    {
    if (this.page > 1) {
        this.page = this.page - 1;
        this.displayRecordPerPage(this.page);
    }
    }

    handlePageNextAction()
    {
    if (this.page < this.totalPages && this.page !== this.totalPages) {
        this.page = this.page + 1;
        this.displayRecordPerPage(this.page);
    }
    }

    displayRecordPerPage(page)
    { 
        this.startingRecord = (page - 1) * this.pageSize;
        this.endingRecord = page * this.pageSize;
        this.endingRecord = (this.endingRecord > this.totalRecords) ? this.totalRecords : this.endingRecord;
        this.data = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;        
    }
}