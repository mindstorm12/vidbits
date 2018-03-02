const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('/videos/edit', ()=>{
    describe('user visits edit page', ()=>{
        it ('can visit edit page', ()=>{
            //start with being on the create page
            browser.url('/videos/create');
            
            //fill the submission form and submit it
            const itemObject = buildItemObject();
            
            //exercise
            //setvalues to save an object the database
            browser.setValue('input[id=title-input]', itemObject.title);
            browser.setValue('textarea[id=description-input]', itemObject.description);
            browser.setValue('#videoUrl-input', itemObject.videoUrl);

            browser.click('button[type=submit]');
            
            //user should end up on videos/show page. find a link with #edit button and click on it
            
            browser.click('a[id=edit]');
            
            //user should be on video/edit page. Assert that
            assert.include(browser.getText('body'), 'Edit this post');
        });
        
        it ('insert new title value', ()=>{
            //start with being on the create page
            browser.url('/videos/create');
            
            //fill the submission form and submit it
            const itemObject = buildItemObject();
            const newTitle = 'new Title';
            
            //exercise
            //setvalues to save an object the database
            browser.setValue('input[id=title-input]', itemObject.title);
            browser.setValue('textarea[id=description-input]', itemObject.description);
            browser.setValue('#videoUrl-input', itemObject.videoUrl);

            browser.click('button[type=submit]');
            
            //user should end up on videos/show page. find a link with #edit button and click on it
            
            browser.click('a[id=edit]');
            
            browser.setValue('input[id=title-input]', newTitle);
            browser.click('button[type=submit]');
            
            //at this point the user would be redirected to videos/show page. assert that the post has an updated title
            
            assert.notInclude(browser.getText('body'), itemObject.title);
            assert.include(browser.getText('body'), newTitle);
           
            });
    });
});

























