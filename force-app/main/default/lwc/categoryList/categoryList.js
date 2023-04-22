import { LightningElement, track, wire } from 'lwc';
import BookCategory from '@salesforce/apex/fetchBookCategoryData.bCatlist';
import {publish, MessageContext } from 'lightning/messageService';
import Search_File from '@salesforce/messageChannel/messagingChannel__c';
export default class CategoryList extends LightningElement {

    data;
    error;

    @wire(MessageContext)
    messageContext;

    connectedCallback()
    {
        BookCategory()
        .then(result =>
        { 
                this.data = result;
                console.log('-----------------');
                console.log(this.data.length);
                console.log('-----------------');
        }).catch(error => {
            this.data = 'Record not Found';
        })
    }

    handleClick()
    {}

    handleSelect(event) {
        const selectedName = event.detail.name;
        console.log(selectedName);
        
        const payload = {
            BookCat: selectedName,
       };
        console.log('-----------------');
        console.log('Payload: '+JSON.parse(JSON.stringify(payload.BookCat)));
        publish(this.messageContext, Search_File, payload);
    }
}