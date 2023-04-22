import { LightningElement, wire, track } from 'lwc';
import fetchBookCatData from '@salesforce/apex/FetchSearchRecords.fetchBookCatData';
import fetchAuthData from '@salesforce/apex/FetchSearchRecords.fetchAuthData';
import { publish, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
export default class SearchFunctionality extends LightningElement {


    @track catOptions;
    @track authOption;
    
    @track bookName;
    @track bcat;
    @track AuthName;

    @track bookLabel;
    @track authorLabel;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {

        fetchBookCatData()
            .then(result => { 
                let boCatarry = [];                    
                    boCatarry[0] = {label: 'None', value: 'noneValue'};
            
                for (var i = 0; i < result.length; i++) {
                    boCatarry.push({ label: result[i].Name, value: result[i].Id });
                }    
                this.catOptions = boCatarry;
            })
        
            fetchAuthData()
            .then(result => { 

                let autharry = [];
                autharry[0] = {label: 'None', value: 'noneValue'};
            
                for (var i = 0; i < result.length; i++) { 
                    autharry.push({ label: result[i].Name, value: result[i].Id });
            }
            this.authOption = autharry;
            })
        
        
    }
    
    get Categoryoptions() {
        return this.catOptions;
    }
    
    get Authoroptions() { 
        return this.authOption;
    }

    bookChangeHandler(event) {
        this.bookName = event.detail.value;
        console.log('bookName:', this.bookName);
    }
    
    handleCategoryOnChange(event) {
        this.bcat = event.detail.value;
        this.bookLabel = event.target.options.find(opt => opt.value === event.detail.value).label;
        // console.log(this.bookLabel);
    }
    
    handleAuthorOnChange(event) {
        this.AuthName = event.detail.value; 
        this.authorLabel = event.target.options.find(opt => opt.value === event.detail.value).label;
        // console.log(this.authorLabel);
    }

    SearchHandler()
    { 
        // console.log('Me Click ho gya be');
        // console.log(this.bookName);
        // console.log(this.bcat);
        // console.log(this.AuthName);

        // if (this.bookName == null) {
        //     this.bookName = null;
        //     console.log('bookName:', this.bookName);
        // }
        //  else
        //  {
        //     console.log('bookName:', this.bookName);
        //  }
 
        if (this.bookName == undefined || this.bookName == '') {
            this.bookName = null;
            console.log('bookName:', this.bookName);
        }
        else {
            console.log('bookName:', this.bookName);
         }
      

         if (this.authorLabel == undefined || this.authorLabel == 'None') {
             this.authorLabel = null;
             console.log('authorLabel:', this.authorLabel);
         }
         else
         { 
             console.log('authorLabel:', this.authorLabel);
         }
 
         if (this.bookLabel == undefined || this.bookLabel == 'None') {
             this.bookLabel = null
             console.log('bookLabel:', this.bookLabel);
         }
         else
         { 
             console.log('bookLabel:', this.bookLabel);
         }
        
        const isEnable = true;
        const payload = {
            bookId: this.bookName,
            bookCategory: this.bookLabel,
            AuthorName: this.authorLabel,
            IsVisibleValue: isEnable,
        };
        // console.log('-----------------');
        // console.log('Payload: '+payload);
        publish(this.messageContext, Search_File, payload);
    }
}