var  Db = require('./database/dboperations');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();
const configMensaje = require('./configMensaje');

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors()); // {origin :'http://localhost:8090'}
app.use('/api', router);

router.use((request, response, next) => {
  next();
});
 
 
router.route('/courses').post((request, response) => {
  Db.getCourses(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/schedule').post((request, response) => {
  Db.getSchedule(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/coursesAdmin').post((request, response) => {
  Db.getcoursesAdmin(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/courses/:id').get((request, response) => {
  Db.getCourse(request.params.id).then((data) => {
    response.json(data[0]);
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

router.route('/obtenerMatricula').get((request, response) => {
  Db.obtenerMatricula().then((data) => {
    response.json(data[0]);
  })
})

router.route('/requestCourse').post((request, response) => {
  Db.getrequestCourse(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/abrirMatricula').post((request, response) => {
  Db.abrirMatricula(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/cerrarMatricula').post((request, response) => {
  Db.cerrarMatricula(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/addRequestStudent').post((request, response) => {
  Db.addRequestStudent(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/getRequestStudent').post((request, response) => {
  Db.getRequestStudent(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/getCoursesResumen').post((request, response) => {
  Db.getCoursesResumen(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/groups/getGroupMatriculado').post((request, response) => {
  Db.getGroupMatriculado(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/getCoursesInclusion').post((request, response) => {
  Db.getCoursesInclusion(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/getCoursesAdd').post((request, response) => {
  Db.getCoursesAdd(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/groups/aumentarCupos').post((request, response) => {
  Db.aumentarCupos(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/updateRequestCourse').post((request, response) => {
  Db.updateRequestCourse(request.body).then((data) => {
    response.json(data[0]);
  })
})

router.route('/groups/course').post((request, response) => {
  Db.getGroupsCourseSP(request.body).then((data) => {
    response.json(data[0]);
  })
})

router.route('/groups/courseAdmin').post((request, response) => {
  Db.getGroupsCourseAdmin(request.body).then((data) => {
    response.json(data[0]);
  })
})

router.route('/groups/update').post((request, response) => {
  Db.updateGroup(request.body).then((data) => {
    response.json(data);
  })
})

router.route('/loginUser').post((request, response) => {
  Db.loginUser(request.body).then(data  => {
    response.send(data);
  })
})

router.route('/recovery/:mail').get((request, response) => {
  Db.checkMail(request.params.mail).then(data  => {
    response.send(data);
  })
})

router.route('/checkCode').post((request, response) => {
  Db.checkCode(request.body).then(data  => {
    response.send(data);
  })
})

router.route('/updatePass').post((request, response) => {
  Db.updatePasswordSP(request.body).then(data  => {
    response.send(data);
  })
})

router.route('/checkLogIn').post((request, response) => {
  Db.checkLogIn(request.body).then((data) => {
    response.send(data);
  })
})

router.route('/sendMail').post((request, response) => {
  configMensaje(request.body);
  response.send(true);
})
  
var  port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);