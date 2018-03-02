const router = require('express').Router();

const Video = require('../models/video');

//home page
router.get('/', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos', {videos});
    
});

// Add additional routes below:
//route renders create page
router.get('/videos/create', async (req, res, next)=> {
    
    res.render('create');

});

//route creates a post and renders show page
router.post('/videos', async (req, res, next) => {
    
    const title = req.body.title;
    const description = req.body.description;
    const videoUrl = req.body.videoUrl;
    
    const newVideo = new Video({title, description, videoUrl});
    
    newVideo.validateSync();
    
    if (newVideo.errors) {
        res.status(400).render('create', {newVideo:newVideo});
        
    } else {
        await newVideo.save();
        res.redirect(`/videos/${newVideo._id}`);
    }

});

//route finds video from database and renders show page
router.get('/videos/:id', async (req, res, next) => {
    
    const VideoId = req.params.id;
  const videos = await Video.findById({_id:VideoId});
    
  res.render('show', {videos});
});

//route finds video from database and renders edit page
router.get('/videos/:id/edit', async (req, res, next) => {
    
    const VideoId = req.params.id;
  const newVideo = await Video.findById({_id:VideoId});
    
  res.render('edit', {newVideo});
});


//route deletes video from database
router.post('/videos/:id/deletions', async (req, res, next) => {
    
    const VideoId = req.params.id;
    
    await Video.remove({_id:VideoId});
    res.redirect('/');

});

//route updates video with the given id and renders show page
router.post('/updates', async (req, res, next) => {
    
    const VideoId = req.body.Videoid;
    
    const title = req.body.title;
    const description = req.body.description;
    const videoUrl = req.body.videoUrl;
    
    const testVideo = new Video({title, description, videoUrl});
    
    testVideo.validateSync();
    
    if (testVideo.errors) {
    const newVideo = await Video.findById({_id:VideoId});
        res.status(400).render('edit', {newVideo});
        
    } else {
        await Video.update({'_id':VideoId}, 
                     {$set:
                      {'title':title,
                          'description':description,
                        'videoUrl':videoUrl
                      }
                     });
    
        const videos = await Video.findById({_id:VideoId});

        res.redirect(`/videos/${videos._id}`);
    }
    
    
});


module.exports = router;
