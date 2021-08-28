var  Db = require('./dboperations');

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
 
 
router.route('/students').get((request, response) => {
  Db.getStudents().then((data) => {
    response.json(data);
  })
})

router.route('/students/:nombre').get((request, response) => {
  Db.getStudent(request.params.id).then((data) => {
    response.json(data[0]);
  })
})

router.route('/students').post((request, response) => {
  let  order = { ...request.body }
  Db.addStudent(order).then(data  => {
    response.status(201).json(data);
  })
})
  
  
var  port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);