import { LightningElement, track, wire } from 'lwc';
import getBookList from '@salesforce/apex/FetchRecordsForDataTable.getBookList';
import getSearchList from '@salesforce/apex/FetchRecordsForDataTable.getSearchList';
import deleteBookRecords from '@salesforce/apex/FetchRecordsForDataTable.deleteBookRecords';
import { refreshApex } from '@salesforce/apex';
import {deleteRecord} from 'lightning/uiRecordApi';
import {publish, subscribe, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete'},
];

export default class BookDataTable extends LightningElement {
   

    @track endingRecord = 0;
    @track startingRecord = 1;
    @track page = 1;
    @track totalRecords;
    @track error = null;
    @track pageSize = 10;
    @track totalPages;
    @track isPrev = false;
    @track isNext = false;
    @track data;
    @track items;
    subscription = null;
    @track bName;
    @track bCat;
    @track aName;
    // @track idbook;
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
        this.bName = message.bookId;
        this.bCat = message.bookCategory;
        this.aName = message.AuthorName;
    
      
            console.log('Book Name: '+this.bName);
            console.log('Book Category: '+this.bCat);
            console.log('Author Name: '+this.aName);
    
    }

    @track columns =
        [
            { label: "Id", fieldName: "Id" },
            { label: "Name", fieldName: "Book_Name__c" },
            { label: "Book Category", fieldName: "Books_Category__c" },
            { label: "Category", fieldName: "Category__c"},
            { label: "Author", fieldName: "Author__c" },
            { label: "Description", fieldName: "Description__c" },
            { label: "Publishing Date", fieldName: "Date_of_Publishing__c" },
            { label: "Publisher", fieldName: "Publisher__c" },
            { label: "Price__c", fieldName: "Price__c" },

            {
                type: 'action',
                typeAttributes: { rowActions: actions },
            },
        ];
    // @wire(deleteRecords) deleteBookRecords;
    @wire(getBookList) updateRecords;
    
    @wire(getBookList) getBookData({error, data})
    { 
       if (data) {
            this.data = data.map(dar => Object.assign(
                {"Id": dar.Id},
                { "Book_Name__c": dar.Book_Name__c },
                { "Books_Category__c": dar.Books_Category__r.Name },
                { "Author__c": dar.Author__r.Name },
                { "Category__c": dar.Category__c},
                { "Description__c": dar.Description__c },
                { "Date_of_Publishing__c": dar.Date_of_Publishing__c },
                { "Publisher__c": dar.Publisher__c },
                { "Price__c": dar.Price__c },
            ));
         
        //     console.log('--------------------')
        //    console.log(this.data.length);
        //    console.log('--------------------')
        //    console.log(this.bName);
        //    console.log(this.bCat);
        //    console.log(this.aName);
        //     console.log('--------------------')
           
                this.items = this.data;
                this.totalRecords = this.data.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                this.data = this.items.slice(0, this.pageSize);
           this.endingRecord = this.pageSize;
        }
        else if (error)
        {
            this.data = undefined;
        }
    }

    @wire(getSearchList, { book: '$bName', bookCategory: '$bCat', authorName: '$aName'}) getSearchData({error, data})
    { 
       if (data) {
            this.data = data.map(dar => Object.assign(
                {"Id": dar.Id},
                { "Book_Name__c": dar.Book_Name__c },
                { "Books_Category__c": dar.Books_Category__r.Name },
                { "Author__c": dar.Author__r.Name },
                { "Category__c": dar.Category__c},
                { "Description__c": dar.Description__c },
                { "Date_of_Publishing__c": dar.Date_of_Publishing__c },
                { "Publisher__c": dar.Publisher__c },
                { "Price__c": dar.Price__c },
            ));
         
        //     console.log('--------------------')
        //    console.log(this.data.length);
        //    console.log('--------------------')
        //    console.log(this.bName);
        //    console.log(this.bCat);
        //    console.log(this.aName);
        //     console.log('--------------------')

                this.items = this.data;
                this.totalRecords = this.data.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                this.data = this.items.slice(0, this.pageSize);
           this.endingRecord = this.pageSize;
        }
        else if (error)
        {
            this.data = undefined;
        }
    }

    handleRowAction(event)
    { 
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const idbook = JSON.parse(JSON.stringify(row.Id));
        const isEnable = false;

         switch (actionName)
        { 
            case 'edit':
                //  console.log('Edit button clicked', JSON.parse(JSON.stringify(row)));
                 const payLoad = {
                     bookRecordId: JSON.parse(JSON.stringify(row.Id)),
                     IsVisibleValue: isEnable
                 };
                 publish(this.messageContext, Search_File, payLoad);
                //  console.log(JSON.parse(JSON.stringify(payLoad)));
                 break;
                        
             case 'delete':
                //  console.log('Delete button clicked: ',idbook);
                 this.handleDeleteRow(idbook);
                break;
            
            default:
        }
    }

    handleDeleteRow(recordIdToDelete) {
        console.log('handleDeleteRow: ', recordIdToDelete);
        deleteBookRecords({ bookrecordId: recordIdToDelete })
            .then((res) => {
                const evt = new ShowToastEvent({
                    title: 'Success Message',
                    message: 'Record deleted',
                    variant: 'success',
                });
                this.dispatchEvent(evt);
                return refreshApex(this.updateRecords);
            })
            .catch(error => {
                window.alert(JSON.parse(JSON.stringify(error)));
            });
    }

    get isDisplayNoRecords() 
    {
        var isDisplay = false;
        if(this.data){
            if(this.data.length != 0){
                isDisplay = false;
            }else{  
                isDisplay = true;
            }
            return isDisplay;
        }
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