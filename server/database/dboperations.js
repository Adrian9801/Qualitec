var  config = require('./dbconfig');
const  sql = require('mssql');
var jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
var user = [];
var token = '';
var tokenRecovery = '';
var secret = '';

async  function  getCourses(){
  try {
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request().query("SELECT * from curso");
    return  courses.recordsets;
  }
  catch (error) {
    console.log(error);
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
      secret = (await bcryptjs.hashSync(Date.now()+'',8));
      tokenRecovery = jwt.sign({user: userLogin[0][0].cedula, code: result, type: 0}, secret, { expiresIn: '5m' });
      return [{code: result}];
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
        secret = (await bcryptjs.hashSync(Date.now()+'',8));
        tokenRecovery = jwt.sign({user: userLogin[0][0].carnet+'', code: result, type: 1}, secret, { expiresIn: '3m' });
        return [{code: result}];
      }
    }
    return false;
  }
  catch (error) {
    return false
  }
}


async function checkCode(code) {
  try {
    if(code == jwt.verify(tokenRecovery, secret).code){
      tokenRecovery = jwt.sign({user: jwt.verify(tokenRecovery, secret).user, code: code, type: jwt.verify(tokenRecovery, secret).type}, secret, { expiresIn: '3m' });
      return true;
    }
    return false;
  } catch (error) {
    return false;
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
      secret = (await bcryptjs.hashSync(Date.now()+'',8));
      token = jwt.sign({  user: userLogin[0][0].cedula }, secret, { expiresIn: '1h' });
      userLogin[0].push({student:false});
      user = userLogin[0];
    }
    else{
      userLogin = (await  pool.request()
      .input('correo', sql.VarChar, userData.correo)
      .query("SELECT * from estudiante where estudiante.correo = @correo")).recordsets;
      if(userLogin[0].length != 0 && (await bcryptjs.compare(userData.pass,userLogin[0][0].contrasena))){
        secret = (await bcryptjs.hashSync(Date.now()+'',8));
        token = jwt.sign({  user: userLogin[0][0].carnet }, secret, { expiresIn: '1h' });
        userLogin[0].push({student:true});
        user = userLogin[0];
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

async function checkLogIn() {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

async function getUser() {
  try {
    return user;
  }
  catch (error) {
    console.log(error);
  }
}

async function logout() {
  token = '';
  secret = '';
  user = [];
  return true;
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

async function getGroupsCourseSP(CourseId) {
  try {
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idC', sql.VarChar, CourseId)
      .query("EXEC getGroupsCourseSP @curso_codigo = @idC");
    return  group.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function updatePasswordSP(password) {
  try {
    let user = jwt.verify(tokenRecovery, secret).user;
    let passwordHash = await bcryptjs.hashSync(password,8);
    let type = jwt.verify(tokenRecovery, secret).type;
    let  pool = await  sql.connect(config);
    await  pool.request()
      .input('userIdent', sql.VarChar, user)
      .input('pass', sql.VarChar, passwordHash)
      .input('typeUser', sql.VarChar, type)
      .query("EXEC updatePasswordSP @user = @userIdent, @newPassword = @pass, @type = @typeUser");
    tokenRecovery = '';
    secret = '';
    return true;
  }
  catch (error) {
    return false;
  }
}
  
module.exports = {
  getCourses:  getCourses,
  getCourse:  getCourse,
  addCourse:  addCourse,
  getGroups:  getGroups,
  getGroup:  getGroup,
  addGroup:  addGroup,
  getGroupsCourse: getGroupsCourse,
  getGroupsCourseSP: getGroupsCourseSP,
  loginUser: loginUser,
  checkLogIn: checkLogIn,
  logout: logout,
  getUser: getUser,
  checkMail: checkMail,
  checkCode: checkCode,
  updatePasswordSP: updatePasswordSP
}