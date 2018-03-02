const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits Create page', ()=>{
    
    describe('posts new item', ()=>{
        it ('submits a video title',  ()=>{
            //setup
             browser.url('/videos/create');
            //create a sample object using buildItemObject defined in test-utils.js
            const itemObject = buildItemObject();
            
            //exercise
            //setvalues to save an object the database
            browser.setValue('input[id=title-input]', itemObject.title);
            browser.setValue('textarea[id=description-input]', itemObject.description);
            browser.setValue('#videoUrl-input', itemObject.videoUrl);

            browser.click('button[type=submit]');
            
            //verify
            assert.include( browser.getText('body'), itemObject.title);
            assert.include( browser.getText('body'), itemObject.description);
            assert.include( browser.getHTML('body'), itemObject.videoUrl);


        });
    });
    
    
});
