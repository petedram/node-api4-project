const express = require('express');

const router = express.Router();

//R - GET list of posts for a user.
router.get('/:id', validateUserId, (req, res) => {
  userDb.getUserPosts(req.params.id)
      .then(db => {
          res.status(200).json(db);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              error: "The users information could not be retrieved.",
          })
      })
});


//C - Post new post for a user.
// requires text: and user_id: 
router.post('/:id', validatePost, (req, res) => {
  const postInfo = {...req.body, user_id: req.params.id } ;
  console.log('req', req.body);
  if (postInfo.text) {
      postDb.insert(postInfo)
      .then(db => {
          res.status(201).json(db);
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              error: "There was an error while saving the post to the database",
          });
      });
  } else {
      console.log('object error');
          res.status(400).json({
              errorMessage: "Please provide text for post.",
          });
  }
});


router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

// validatePost validates the body on a request to create a new post
// if the request body is missing, cancel the request and respond with status 400 and { message: "missing post data" }
// if the request body is missing the required text field, cancel the request and respond with status 400 and { message: "missing required text field" }

function validatePost(req, res, next){
  const postInfo = req.body;

  switch (postInfo.text) {
    case undefined:
      res.status(400).json({message: "missing post data!!!"});
      break;

    case "":
      res.status(400).json({message: "text field is empty!!!"});
      break;

    default:
      next();
  };
};

function validateUserId(req, res, next){
  const user_id = req.params.id;
  
  userDb.getById(user_id)
    .then(id => {
      if (id) {
        next();
      } else {
        res.status(404).json({message: 'id not found '});
      }
    })
    .catch(err => {
      res.status(500).json({message: 'Error retrieving id'})
    })
};


module.exports = router;
