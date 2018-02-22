const {assert} = require('chai');

describe('User visits Landing page', ()=>{
    describe('No videos exist', ()=>{
        it ('#videos-container is empty', ()=>{
            //setup
            //visit the root page where videos are displayed
            browser.url('/');
            
            //exercise
            //check the contents of #videos container
            const contents = browser.getText('#videos-container');
            
            //verify
            //verify if the contents are empty
            assert.equal(contents, '');
            
        });
    });
});
