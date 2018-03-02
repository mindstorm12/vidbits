const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, buildItemObject} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../setup-teardown-utils');

const Video = require('../../models/video');

describe('Server path: /', () => {

    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

  describe('POST', () => {
      
      it ('returns status code 302 when video is created', async() => {
            
          //create an item
          const item =  buildItemObject();

          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          assert.equal(response.status, 302);
      });
      
      it('returns video title', async()=>{
      //create an item
          const item =  buildItemObject();

          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
            const response2 = await request(app).get(response.headers.location);
          //use response2 to move from 'redirecting page' to actual page being redirected to
          
          assert.include(response2.text, item.title);
      });
      
      it('does not save the video when title is not present', async ()=>{
       //create an item
          const item = new Video({title:"",
      description:'This is a test',
      videoUrl: 'nourl',});
                                  
          item.save();
          
          assert.isNotOk(await Video.findOne({_id:item._id}));
      });
      
      it('returns status code 400', async ()=>{
        //create an item
          const item = {title:"",
                description:'This is a test',
                videoUrl: 'nourl',};
          
          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          assert.equal(response.status, 400);
      });

      it('redirects to form when title not present' , async ()=>{
        //create an item
          const item = {title:"",
                description:'This is a test',
                videoUrl: 'nourl',};
          
          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          //form page has Save a video text
          assert.include(response.text, 'Save a Video');
      });
      
      it('renders validation error when title not present' , async ()=>{
        //create an item
          const item = {title:"",
                description:'This is a test',
                videoUrl: 'nourl',};
          
          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          assert.include(parseTextFromHTML(response.text, 'form'), 'required');
      });
      
      it('renders create page with submitted Data when title not present' , async ()=>{
        //create an item
          const item = {title:"",
                description:'This is a test',
                videoUrl: 'nourl',};
          
          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          assert.include(parseTextFromHTML(response.text, 'form textarea'), item.description);
      });
      
      it('renders new video page when data is submitted successfully', async()=>{
         //create an item
          const item =  buildItemObject();

          //submit the item in POST
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          //grab the item from the database
          const itemFromDb = await Video.findOne({title:item.title});
          
          //use response2 to move from 'redirecting page' to actual page being redirected to
          const response2 = await request(app)
                                .get(`${response.headers.location}`)
          
          //verify:
          //check if the current url is equal to the item's specific URL
          assert.equal(response.headers.location, `/videos/${itemFromDb._id}`);
          
          //equals sign is being converted to string format
          assert.include(response2.text, item.videoUrl);
     
      });
      
      it('saved videoUrl matches with sent one', async ()=>{
        //create an item
          const item =  buildItemObject();

          //submit the item in POST
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          //grab the item from the database
          const itemFromDb = await Video.findOne({videoUrl:item.videoUrl});
          
          //verify:
          //check if the current url is equal to the item's specific URL
          assert.equal(itemFromDb.videoUrl, item.videoUrl);
      });
      it('url value is preserved when other data is missing' , async ()=>{
        //create an item
          const item = {title:"",
                description:'This is a test',
                videoUrl: 'nourl',};
          
          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          
          assert.include(response.text, item.videoUrl );
      });
      
      it('Error message is displayed when URL is missing' , async ()=>{
        //create an item
          const item = {title:"Test",
                description:'This is a test',
                videoUrl: '',};
          
          //send the item to the form
            const response = await request(app)
                                .post(`/videos`)
                                .type('form')
                                .send(item);
          //'required' is the validation error message
          assert.include(response.text, 'required');
      });
      
  });
    
    describe('GET/videos/:id/edit', ()=>{
        it ('renders a form to edit the video', async ()=>{
             //create and save an item to the database
          const item = await seedItemToDatabase();
        
        const response = await request(app)
                                    .get(`/videos/${item._id}/edit`);

      assert.include(response.text, 'editPost');
      assert.include(response.text, `${item._id}` );

        });
    });
    
    describe('POST/videos/:id/updates', ()=>{
        it ('updates records', async ()=>{
        //create and save an item to the database
        const item = await seedItemToDatabase();
        const newTitle = {title:'Updated Title',
                      description:'This is a test',
                        videoUrl: 'https://www.youtube.com/embed/MjAtKIbvClw',
                      Videoid:`${item._id}`,
                   };

        const response = await request(app)
                                    .post(`/updates`)
                                    .type('form')
                                    .send(newTitle);
            
          //use response2 to move from 'redirecting page' to actual page being redirected to
            const response2 = await request(app).get(response.headers.location);


        assert.include(parseTextFromHTML( response2.text, 'body'), 'Updated Title');
        assert.equal(response.status, 302);
        assert.equal(response.headers.location, `/videos/${item._id}`);
            
        });
        
        it('does not update with invalid data', async()=>{
            //SETUP
            //create and save an item to the database
            const item = await seedItemToDatabase();
            //title is invalid
            const newTitle = {title:'',
                            description:'This is a test',
                            videoUrl: 'https://www.youtube.com/embed/MjAtKIbvClw',
                            Videoid:`${item._id}`,
                       };
            //EXERCISE
            //submit data to the form
            const response = await request(app)
                                    .post(`/updates`)
                                    .type('form')
                                    .send(newTitle);
            //get updated item from database
            const itemFromDb = await Video.findOne({_id:item._id});
            
            //verify
            //item title should still be the same if not updated
            assert.notEqual(itemFromDb.title, newTitle.title);
            assert.equal(response.status, 400);
            
        });
    } );
    
    describe('/videos/:id/deletions', ()=>{
        it ('deletes the video', async ()=>{
            //SETUP
            //create and save an item to the database
            const item = await seedItemToDatabase();
            
//            EXERCISE
//            submit data to the form
            const response = await request(app)
                                    .post(`/videos/${item._id}/deletions`)
                                    .type('form')
                                    .send('');
            
          //use response2 to move from 'redirecting page' to actual page being redirected to
            const response2 = await request(app).get(response.headers.location);

            
            assert.notInclude(response2.text, item.title);
            
        });
    });
    
    describe('saves video', ()=>{
        it ('can find saved video in the database', async ()=>{
            //create and save an item to the database
          const item =  seedItemToDatabase();
            
            assert.equal(item.title, await Video.findOne({title: item.title}));
        });
    });
});
