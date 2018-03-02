const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../setup-teardown-utils');


describe('Validate Model', ()=>{
    
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('Check inputs', ()=>{
    
        it('title, description and videoUrl are strings', async()=>{
            //setup: create a new videoItem with 9 as title, pass in an integer
            const videoItem = new Video({title:9,
                                        description:9,
                                        videoUrl:9});
            
              //verify: check if the value saved in videoItem is '9', i.e. a string
            assert.strictEqual(videoItem.title, '9');
             
            //verify: check if the value saved in videoItem is '9', i.e. a string
            assert.strictEqual(videoItem.description, '9');
            
            //verify: check if the value saved in videoItem is '9', i.e. a string
            assert.strictEqual(videoItem.videoUrl, '9');
        });
        
        it('a URL is required', async()=>{
            //setup: create a new videoItem with 9 as title, pass in an integer
            const videoItem = new Video({title:'skyscraper and cloud dreams',
                                        description:'This is not a drill',
                                        videoUrl:''});
            
            videoItem.save();
            
              //verify: check if the video as been saved
            assert.isNotOk(await Video.findOne({title:videoItem.title}));
             

        });
    
    });
    
});