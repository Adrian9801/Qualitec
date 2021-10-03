var  config = require('./dbconfig');
const  sql = require('mssql');
var jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

async function getCourses(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request()
      .input('carnet', sql.Int, parseInt(userLogin.carnet))
      .query("EXEC getStudentCourses @carnetE = @carnet");
    let courseList = courses.recordsets;
    courseList.push(info);
    return courseList;
  } catch (error) {
    return [];
  }
}

async function getSchedule(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request()
      .input('carnet', sql.Int, parseInt(userLogin.carnet))
      .query("EXEC getSchedule @carnet_estudiante = @carnet");
    let courseList = courses.recordsets;
    courseList.push(info);
    return courseList;
  } catch (error) {
    return [];
  }
}

async function getcoursesAdmin(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request()
      .query("EXEC getCoursesTotal");
    let courseList = courses.recordsets;
    courseList.push(info);
    return courseList;
  } catch (error) {
    return [];
  }
}

async function getCoursesAdd(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request()
      .query("SELECT * from curso");
    let courseList = courses.recordsets;
    courseList.push(info);
    return courseList;
  } catch (error) {
    return [];
  }
}

async function getCoursesResumen(req){
  try {
    let userLogin = parseInt(jwt.verify(req.token, 'secret-Key').user.carnet);
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request()
      .input('carnet', sql.Int, userLogin)
      .query("EXEC getCoursesMatriculados @carnet_estudiante = @carnet");
    let courseList = courses.recordsets;
    return courseList;
  } catch (error) {
    return [];
  }
}

async function getGroupMatriculado(req){
  try {
    let userLogin = parseInt(jwt.verify(req.token, 'secret-Key').user.carnet);
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('carnet', sql.Int, userLogin)
      .input('codCourse', sql.VarChar, req.courseId)
      .query("EXEC getGroupMatriculado @carnet_estudiante = @carnet, @codigo_curso = @codCourse");
    let groupL = group.recordsets;
    return groupL[0];
  } catch (error) {
    return [];
  }
}

async function getCoursesInclusion(req){
  try {
    let userLogin = parseInt(jwt.verify(req.token, 'secret-Key').user.carnet);
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request()
      .input('carnet', sql.Int, userLogin)
      .query("EXEC getCoursesInclusion @carnet_estudiante = @carnet");
    let courseList = courses.recordsets;
    return courseList;
  } catch (error) {
    return [];
  }
}

async function createNewGroup(req){ //FALTA
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  result = await  pool.request()
      .input('carnet', sql.Int, userLogin)
      .query("EXEC createNewGroup @numero , @sede , @cupos , @cedulaProf , @horario , @horaI , @horaF , @codCurso , @aula ");
    let resultList = result.recordsets;
    resultList.push(info);
    return resultList;
  } catch (error) {
    return [];
  }
}

async function aumentarCupos(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  result = await  pool.request()
      .input('idG', sql.VarChar, req.codeGroup)
      .input('cant', sql.VarChar, req.cant)
      .query("EXEC increasePlaces @codigo_grupo = @idG, @cantidad = @cant");
    let resultList = result.recordsets[0];
    resultList.push(info);
    return resultList;
  } catch (error) {
    return [];
  }
}

async function addRequestStudent(req){//falta NELSON
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  result = await  pool.request()
      .input('carnet', sql.Int, parseInt(userLogin.carnet))
      .input('idC', sql.VarChar, req.codCurso)
      .query("EXEC increasePlaces @carnet_estudiante = @carnet, @codigo_curso = @idC");
    let resultList = result.recordsets;
    resultList.push(info);
    return resultList;
  } catch (error) {
    return [];
  }
}

async function getRequestStudent(req){//falta MOISES
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  result = await  pool.request()
      .input('carnet', sql.Int, parseInt(userLogin.carnet))
      .query("EXEC getStudentRequirementCourses @carnetE = @carnet");
    let resultList = result.recordsets;
    resultList.push(info);
    return resultList;
  } catch (error) {
    return [];
  }
}

async function abrirMatricula(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    /*let  pool = await  sql.connect(config);
    let  result = await  pool.request()
      .query("EXEC abrirMatricula");*/
    return [info];
  } catch (error) {
    return [];
  }
}

async function cerrarMatricula(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    /*let  pool = await  sql.connect(config);
    let  result = await  pool.request()
      .query("EXEC cerrarMatricula");*/
    return [info];
  } catch (error) {
    return [];
  }
}

async function getGroupsCourseAdmin(req){
  try {
    let  pool = await  sql.connect(config);
    let  groups = await  pool.request()
      .input('idC', sql.VarChar, req.courseId)
      .query("EXEC getGroupsCourseAdmin  @codigo_curso = @idC");
    let groupsList = groups.recordsets;
    return groupsList;
  } catch (error) {
    return [];
  }
}

async function getTeachers(){
  try {
    let  pool = await  sql.connect(config);
    let  teachers = await  pool.request()
      .query("SELECT * from profesor");
    let teachersList = teachers.recordsets;
    return teachersList;
  } catch (error) {
    return [];
  }
}

async function obtenerMatricula(){
  try {
    let  pool = await  sql.connect(config);
    let  matricula = await  pool.request()
      .query("EXEC obtenerEstadoMatricula");
    let codigo = matricula.recordsets;
    return codigo;
  } catch (error) {
    return [];
  }
}

async function getrequestCourse(req){
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  request = await  pool.request()
      .query("EXEC getRequirementLiftRequests");
    let requestList = (request.recordsets);
    requestList.push(info);
    return requestList;
  } catch (error) {
    return [];
  }
}

async function updateRequestCourse(req){
  try {
    let  pool = await  sql.connect(config);
    let request = await pool.request()
      .input('carnet', sql.Int, parseInt(req.carnet))
      .input('codC', sql.VarChar, req.codCurso)
      .input('estadoSoli', sql.Int, req.estado)
      .query("EXEC updateSolicitudes @carnet_estudiante = @carnet, @codigo_curso = @codC, @estado = @estadoSoli");
    return [];
  } catch (error) {
    return [];
  }
}

async function getCourse(CourseId) {
  try {
    let  pool = await  sql.connect(config);
    let  course = await  pool.request()
      .input('idC', sql.VarChar, CourseId)
      .query("SELECT * from curso where curso.codigo = @idC");
    return  course.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function checkMail(mail) {
  try {
    let pool = await  sql.connect(config);
    let userLogin = (await  pool.request()
      .input('correo', sql.VarChar, mail)
      .query("SELECT * from administrador where administrador.correo = @correo")).recordsets;
    if(userLogin[0].length != 0){
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < 8; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return [{code: result}, {tokenRecovery: jwt.sign({user: userLogin[0][0].cedula, code: result, type: 0}, 'secret-Key', { expiresIn: '4m' })}];
    }
    else{
      userLogin = (await  pool.request()
      .input('correo', sql.VarChar, mail)
      .query("SELECT * from estudiante where estudiante.correo = @correo")).recordsets;
      if(userLogin[0].length != 0){
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 8; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return [{code: result}, {tokenRecovery: jwt.sign({user: userLogin[0][0].carnet+'', code: result, type: 1}, 'secret-Key', { expiresIn: '4m' })}];
      }
    }
    return [];
  }
  catch (error) {
    return []
  }
}


async function checkCode(req) {
  try {
    if(req.code == jwt.verify(req.token, 'secret-Key').code){
      return [{tokenRecovery: jwt.sign({user: jwt.verify(req.token, 'secret-Key').user+'', code: req.code, type: jwt.verify(req.token, 'secret-Key').type}, 'secret-Key', { expiresIn: '4m' })}];
    }
    return [];
  } catch (error) {
    return [];
  }
}
 
async function addCourse(Course) {
  try {
    let  pool = await  sql.connect(config);
    let  insertCourse = await  pool.request()
      .input('codigo', sql.VarChar, Course.id)
      .input('nombre', sql.VarChar, Course.name)
      .input('creditos', sql.Int, Course.credits)
      .execute('InsertCourse');
      return  insertCourse.recordsets;
  }
  catch (err) {
    console.log(err);
  }
}

async function getGroups() {
  try {
    let  pool = await  sql.connect(config);
    let  groups = await  pool.request().query("SELECT * from grupo");
    return  groups.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function getGroup(CourseId, GroupId) {
  try {
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idG', sql.Int, GroupId)
      .input('idC', sql.VarChar, CourseId)
      .query("SELECT * from grupo where codigo = @idG and codigo_curso = @idC");
    return  group.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function getGroupsCourse(CourseId) {
  try {
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idC', sql.VarChar, CourseId)
      .query("SELECT * from grupo where codigo_curso = @idC");
    return  group.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function loginUser(userData) {
  try {
    //console.log(await bcryptjs.hashSync(userData.pass,8));
    let  pool = await  sql.connect(config);
    let  userLogin = (await  pool.request()
      .input('correo', sql.VarChar, userData.correo)
      .query("SELECT * from administrador where administrador.correo = @correo")).recordsets;
    if(userLogin[0].length != 0 && (await bcryptjs.compare(userData.pass,userLogin[0][0].contrasena))){
      userLogin[0].push({student:false});
      userLogin[0].push({tokenAuth: jwt.sign({user: userLogin[0][0], student: false}, 'secret-Key', { expiresIn: '16m' })});
    }
    else{
      userLogin = (await  pool.request()
      .input('correo', sql.VarChar, userData.correo)
      .query("SELECT * from estudiante where estudiante.correo = @correo")).recordsets;
      if(userLogin[0].length != 0 && (await bcryptjs.compare(userData.pass,userLogin[0][0].contrasena))){
        userLogin[0].push({student:true});
        userLogin[0].push({tokenAuth: jwt.sign({user: userLogin[0][0], student: true}, 'secret-Key', { expiresIn: '16m' })});
      }
      else{
        userLogin = [[]];
      }
    }
    return userLogin[0];
  }
  catch (error) {
    console.log(error);
  }
}



async function checkLogIn(req) {
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = [{token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent}];
    return info;
  } catch (error) {
    return [];
  }
}
 
async function addGroup(Group) {
  try {
    let  pool = await  sql.connect(config);
    let  insertGroup = await  pool.request()
      .input('idCourse', sql.VarChar, Group.idCourse)
      .input('id', sql.Int, Group.id)
      .input('teacher', sql.VarChar, Course.teacher)
      .input('places', sql.Int, Course.places)
      .execute('InsertCourse');
      return  insertGroup.recordsets;
  }
  catch (err) {
    console.log(err);
  }
}

async function getGroupsCourseSP(req) {
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idC', sql.VarChar, req.codigo)
      .input('userC', sql.Int, req.carnet)
      .query("EXEC getGroupsCourseSP @curso_codigo = @idC, @carnet_estudiante = @userC");
      let list = group.recordsets;
      list.push(info);
      return list;
  }
  catch (error) {
    console.log(error);
    return [];
  }
}

async function updateGroup(req) {
  try {
    let userLogin = jwt.verify(req.token, 'secret-Key').user;
    let isStudent = jwt.verify(req.token, 'secret-Key').student;
    let info = {token: jwt.sign({user:  userLogin, student: isStudent}, 'secret-Key', { expiresIn: '16m' }),
                user: userLogin,
                student: isStudent};
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idG', sql.Int, req.codigo)
      .input('cuposG', sql.Int, req.cupos)
      .input('userC', sql.Int, req.carnet)
      .query("EXEC ActualizarEstadoGrupoEstudiante @grupo_codigo = @idG, @cupo = @cuposG, @carnet_estudiante = @userC");
    let list = group.recordsets;
    list.push(info);
    return list;
  }
  catch (error) {
    console.log(error);
    return [];
  }
}

async function updatePasswordSP(req) {
  try {
    let user = jwt.verify(req.token, 'secret-Key').user;
    let passwordHash = await bcryptjs.hashSync(req.pass,8);
    let type = jwt.verify(req.token, 'secret-Key').type;
    let  pool = await  sql.connect(config);
    await  pool.request()
      .input('userIdent', sql.VarChar, user)
      .input('pass', sql.VarChar, passwordHash)
      .input('typeUser', sql.VarChar, type)
      .query("EXEC updatePasswordSP @user = @userIdent, @newPassword = @pass, @type = @typeUser");
    tokenRecovery = '';
    return true;
  }
  catch (error) {
    return false;
  }
}
  
module.exports = {
  getCourses: getCourses,
  getCourse: getCourse,
  addCourse: addCourse,
  getGroups: getGroups,
  getGroup: getGroup,
  addGroup: addGroup,
  getGroupsCourse: getGroupsCourse,
  loginUser: loginUser,
  checkLogIn: checkLogIn,
  checkMail: checkMail,
  checkCode: checkCode,
  updatePasswordSP: updatePasswordSP,
  getGroupsCourseSP: getGroupsCourseSP,
  updateGroup: updateGroup,
  getSchedule: getSchedule,
  getrequestCourse: getrequestCourse,
  getcoursesAdmin: getcoursesAdmin,
  getGroupsCourseAdmin: getGroupsCourseAdmin,
  obtenerMatricula: obtenerMatricula,
  cerrarMatricula: cerrarMatricula,
  abrirMatricula: abrirMatricula,
  getCoursesAdd: getCoursesAdd,
  aumentarCupos: aumentarCupos,
  updateRequestCourse: updateRequestCourse,
  getCoursesResumen: getCoursesResumen,
  getCoursesInclusion: getCoursesInclusion,
  addRequestStudent: addRequestStudent,
  getRequestStudent: getRequestStudent,
  getGroupMatriculado: getGroupMatriculado,
  createNewGroup: createNewGroup,
  getTeachers: getTeachers
}