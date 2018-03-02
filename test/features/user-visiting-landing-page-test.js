const {assert} = require('chai');
const {seedItemToDatabase} = require('../test-utils');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

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
    
    describe('Click on Create Link', () => {
        it ('User ends up on /create/', () => {
            //setup
            //get the link to the create page and set up variables that may exist on create page
            const link = 'a[href="/videos/create"]';
            const text = 'Save a Video';
            browser.url('/');
            
            //exercise
            //click on the link
            browser.click(link);
            
            //verify
            //verify something that would exist on the create page eg. title which may be 'Create'
            assert.include(browser.getText('button[type=submit]'), text);
            
        });
    });
    
    describe('lands on a page with an existing video', ()=>{    
        
        it('page has an iframe tag', async ()=>{
            //setup:
            //add an object to database
            const item = await seedItemToDatabase();
            //go to the landing page ang get html content
            await browser.url('/');

            //exercise:
            
            //verify:
            //verify if the html content has an iFrame tag
            assert.include( await browser.getHTML('body'), item.videoUrl);
            
            
        });
        
        it('can navigate to existing video', async ()=>{
                //setup:
            //add an object to database
            const item = await seedItemToDatabase();
            //go to the landing page and get html content
            browser.url('/');
            const link = browser.click(`body a[href=${item._id}]`);
            //exercise:
            
            //verify:
            //verify if the html content has an iFrame tag
            assert.include(await browser.getHTML('body'), 'iframe');
        });
    });
});
