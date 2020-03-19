const express = require('express');
const server = express();
const postRouter = require('./posts/postRouter');


//Databases
const userDb = require('./users/userDb.js');
const postDb = require('./posts/postDb.js')

//Middleware
server.use(logger);
server.use(express.json());

// server.use(validateUserId);
server.use('/posts/', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// server.get('/:id', validateUserId, (req, res) => {
//   res.send(`<h2>Let's write some middleware! </h2>`, req.hub);
// });

//CRUD on users
// C - POST new user
server.post('/users', validateUser, (req, res) => {
  const userInfo = req.body;
  console.log('req', req.body);
  if (userInfo.name) {
      userDb.insert(req.body)
      .then(db => {
          res.status(201).json(db);
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              error: "There was an error while saving the user to the database",
          });
      });
  } else {
      console.log('object error');
          res.status(400).json({
              errorMessage: "Please provide name for user.",
          });
  }
});

// R - GET list of users
server.get('/users', (req, res) => {
  userDb.get(req.query)
      .then(db => {
          res.status(200).json(db);
          res.send('/users');
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              error: "The users information could not be retrieved.",
          })
      })
});

// U - PUT a user
//update(): accepts two arguments, the first is the id of the resource to update and 
//the second is an object with the changes to apply. It returns the count of updated records. 
//If the count is 1 it means the record was updated correctly.

server.put('/users/:id', validateUserId, (req, res) => {
  if (req.body.name) {
  userDb.update(req.params.id, req.body)
      .then(db => {
          if (db) {
              res.status(200).json(db);
          } else {
              res.status(404).json({ message: "The post with the specified ID does not exist!!!!!!." });
          }
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              message: 'Error updating',
          });
      });
  } else {
      console.log('object error');
      res.status(400).json({
          errorMessage: "Please provide name"
      });
  }
});


// D - DELETE a user
server.delete('/users/:id', (req, res) => {
  userDb.remove(req.params.id)
      .then(count => {
          if (count > 0) {
              res.status(200).json({ message: 'The post has been removed' });
          } else {
              res.status(404).json({ message: 'The post with the specified ID does not exist.' });
          }
      })
      .catch(error => {
          // log error to database
          console.log(error);
          res.status(500).json({
              message: 'The post could not be removed',
          });
      });
});





//custom middleware

// request method, request url, and a timestamp
function logger(req, res, next) {
  console.log(`Logger ${req.method} ${req.url} ${Date.now()} `); 
  next();
}

// validateUserId validates the user id on every request that expects a user id parameter
// if the id parameter is valid, store that user object as req.user
// if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }

//request which requires user_id param: all Posts. example: 

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

// validateUser()
// validateUser validates the body on a request to create a new user
// if the request body is missing, cancel the request and respond with status 400 and { message: "missing user data" }
// if the request body is missing the required name field, cancel the request and respond with status 400 and { message: "missing required name field" }
function validateUser(req, res, next){
  const userInfo = req.body;

  switch (userInfo.name) {
    case undefined:
      res.status(400).json({message: "missing required name field!!!!"});
      break;

    case "":
      res.status(400).json({message: "name field is empty!"});
      break;

    default:
      next();
    }
  }






// var d = new Date();
// var n = d.getSeconds();
//   if (n % 3 !== 0) { 
//   console.log('ok', n);
//   res.status(403).json({message : "You shall not pass!"});
// } else {
//   console.log('not ok', n);
//   next();
// };






module.exports = server;


