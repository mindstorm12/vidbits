const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('Delete', ()=>{
    
    describe('User clicks on delete', ()=>{
        it ('deletes video', ()=>{
            //start with being on the create page
            browser.url('/videos/create');
            
            //fill the submission form and submit it
            const itemObject = buildItemObject();
            
            //exercise
            //setvalues to save an object to the database
            browser.setValue('input[id=title-input]', itemObject.title);
            browser.setValue('textarea[id=description-input]', itemObject.description);
            browser.setValue('#videoUrl-input', itemObject.videoUrl);

            browser.click('button[type=submit]');
            
            //user should end up on videos/show page. find a link with #delete button and click on it
            browser.click('button[id=delete]');
            
            //verify that the post has been deleted. User should return to home page with the list of all items. Deleted item should not be present on it
            assert.notInclude(browser.getText('body'),itemObject.title );
            
            
        });
    });
    
});