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

  describe('GET', () => {
  
    it('displays existing videos in the landing page', async ()=>{
         //create and save an item to the database
          const item = await seedItemToDatabase();
        
        const response = await request(app)
                                    .get(`/`);

      assert.include(parseTextFromHTML(response.text, '.video-title'), item.title);

        
    });
  
  });
      

});
