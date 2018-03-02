const {assert} = require('chai');
const {buildItemObject, seedItemToDatabase} = require('../test-utils');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../setup-teardown-utils');


//tests begin
describe('User visits Video/:id page', ()=>{
    
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);
    
    describe('GET', ()=>{
        it ('renders page with specific video info', async ()=>
        {
            //setup: create a video post
            //create and save an item to the database
            const item = await seedItemToDatabase();
            
            //exercise: visit the newly created video's page
            browser.url(`/videos/${item._id}`);
            
            //verify: verify that the page exists
            
            assert.include(await browser.getText('#videos-container'), item.title);
        });
        
        
    });
});