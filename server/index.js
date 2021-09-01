var  Db = require('./database/dboperations');

var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors()); // {origin :'http://localhost:8090'}
app.use('/api', router);

router.use((request, response, next) => {
  next();
});
 
 
router.route('/courses').get((request, response) => {
  Db.getCourses().then((data) => {
    response.json(data);
  })
})

router.route('/courses/:id').get((request, response) => {
  Db.getCourse(request.params.id).then((data) => {
    response.json(data[0]);
  })
})

router.route('/courses').post((request, response) => {
  let  order = { ...request.body }
  Db.addCourse(order).then(data  => {
    response.status(201).json(data);
  })
})

router.route('/groups').get((request, response) => {
  Db.getGroups().then((data) => {
    response.json(data);
  })
})

router.route('/groups/:idCourse/:id').get((request, response) => {
  Db.getGroup(request.params.idCourse, request.params.id).then((data) => {
    response.json(data[0]);
  })
})

/*router.route('/groups/:idCourse').get((request, response) => {
  Db.getGroupsCourse(request.params.idCourse).then((data) => {
    response.json(data[0]);
  })
})*/

router.route('/groups/:idCourse').get((request, response) => {
  Db.getGroupsCourseSP(request.params.idCourse).then((data) => {
    response.json(data[0]);
  })
})

router.route('/groups').post((request, response) => {
  let  order = { ...request.body }
  Db.addGroup(order).then(data  => {
    response.status(201).json(data);
  })
})

router.route('/loginUser').post((request, response) => {
  Db.loginUser(request.body).then(data  => {
    response.send(data);
  })
})

router.route('/checkLogIn').get((request, response) => {
  Db.checkLogIn().then((data) => {
    response.send(data);
  })
})
  
var  port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);