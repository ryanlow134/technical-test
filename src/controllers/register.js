import Express from 'express';
import { StatusCodes } from 'http-status-codes';
import { DataTypes } from 'sequelize'
import sequelize from '../config/database';
import Logger from '../config/logger';

const Register = Express.Router();
const LOG = new Logger('register.js');

//INSERT INTO DB
export async function insert(obj, db, type) {

  let data = {}
  switch (type) {
    case 'teacher':
      if (obj.email && obj.name) {
        data = {
          where: {
            email: obj.email
          },
          defaults: {
            email: obj.email,
            name: obj.name
          }
        }
      } else {
        return 0
      }
      break;
    case 'students':
      if (obj.email && obj.name) {
        data = {
          where: {
            email: obj.email
          },
          defaults: {
            email: obj.email,
            name: obj.name
          }
        }
      } else {
        return 0
      }
      break;
    case 'subject':
      if (obj.subjectCode && obj.name) {
        data = {
          where: {
            subjectCode: obj.subjectCode
          },
          defaults: {
            subjectCode: obj.subjectCode,
            name: obj.name
          }
        }
      } else {
        return 0
      }
      break;
    case 'classes':
      if (obj.classCode && obj.name) {
        data = {
          where: {
            classCode: obj.classCode
          },
          defaults: {
            classCode: obj.classCode,
            name: obj.name
          }
        }
      } else {
        return 0
      }
      break;
    case 'tcs':
      if (obj.teacher.email && obj.classes.classCode && obj.subject.subjectCode) {
        data = {
          where: {
            email: obj.teacher.email,
            classCode: obj.classes.classCode,
            subjectCode: obj.subject.subjectCode
          },
          defaults: {
            email: obj.teacher.email,
            classCode: obj.classes.classCode,
            subjectCode: obj.subject.subjectCode
          }
        }
      } else {
        return 0
      }
      break;
    case 'sc':
      if (obj.element.email && obj.classes.classCode) {
        data = {
          where: {
            email: obj.element.email,
            classCode: obj.classes.classCode
          },
          defaults: {
            email: obj.element.email,
            classCode: obj.classes.classCode
          }
        }
      } else {
        return 0
      }
      break;
    default: return 0;

  }

  try {
    var [insert, created] = await db.findOrCreate(data);

    if (created === false) {
      return update(obj, db, insert);
    }

    return created;

  } catch (error) {
    return error;
  }
}

//UPDATE DB
export async function update(obj, db, insert) {

  //UPDATE IF EXISTS
  switch (db) {
    case teacherDb:
      await db.update({ name: obj.name }, {
        where: {
          email: insert.email
        }
      });
      break;
    case studentsDb:
      await db.update({ name: obj.name }, {
        where: {
          email: insert.email
        }
      });
      break;
    case classDb:
      await db.update({ name: obj.name }, {
        where: {
          classCode: insert.classCode
        }
      });
      break;
    case subjectDb:
      await db.update({ name: obj.name }, {
        where: {
          subjectCode: insert.subjectCode
        }
      });
      break;
    default:
      return 0;
  }
  return 1;
}

//DEFINE TEACHER TABLE
const teacherDb = sequelize.define('teacher', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'teacher'
});

//DEFINE STUDENT TABLE
const studentsDb = sequelize.define('students', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'students'
});

//DEFINE CLASS TABLE
const classDb = sequelize.define('class', {
  classCode: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'class'
});

//DEFINE SUBJECT TABLE
const subjectDb = sequelize.define('subject', {
  subjectCode: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'subject'
});

//DEFINE TEACHER-CLASS-SUBJECT TABLE
const tcsDb = sequelize.define('tcs', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subjectCode: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'tcs'
});

//DEFINE STUDENT-CLASS TABLE
const scDb = sequelize.define('sc', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classCode: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'sc'
});

//MAIN FUNCTION
const register = async (req, res) => {

  //TEST CONNECTION
  try {
    await sequelize.authenticate();
    LOG['info']('Connection has been established successfully.');

    //SYNC TABLES
    await sequelize.sync();

    //GET REQUEST BODY
    let teacher = req.body.teacher;
    let students = req.body.students;
    let subject = req.body.subject;
    let classes = req.body.class;

    //INSERT TEACHER
    if (teacher) {
      var teacherReturn = insert(teacher, teacherDb, 'teacher');

      if (!teacherReturn) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      } else {
        if (teacherReturn.errno) {
          if (teacherReturn.name != 'SequelizeUniqueConstraintError') {
            LOG['info']('Teacher Create Error:', teacherReturn.name);
            return res.sendStatus(StatusCodes.BAD_REQUEST);
          } else {
            LOG['info'](`Teacher Create Warning: ${teacherReturn.name}`);
          }
        }
      }

    }

    //INSERT SUBJECT
    if (subject) {
      var subjectReturn = insert(subject, subjectDb, 'subject');

      if (!subjectReturn) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      } else {
        if (subjectReturn.errno) {
          if (subjectReturn.name != 'SequelizeUniqueConstraintError') {
            LOG['info']('Teacher Create Error:', subjectReturn.name);
            return res.sendStatus(StatusCodes.BAD_REQUEST);
          } else {
            LOG['info'](`Teacher Create Warning: ${subjectReturn.name}`);
          }
        }
      }
    }

    //INSERT CLASSES
    if (classes) {
      var classReturn = insert(classes, classDb, 'classes');

      if (!classReturn) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      } else {
        if (classReturn.errno) {
          if (classReturn.name != 'SequelizeUniqueConstraintError') {
            LOG['info']('Teacher Create Error:', classReturn.name);
            return res.sendStatus(StatusCodes.BAD_REQUEST);
          } else {
            LOG['info'](`Teacher Create Warning: ${classReturn.name}`);
          }
        }
      }
    }

    //INSERT STUDENTS
    if (students) {
      students.forEach(async element => {
        var studentReturn = insert(element, studentsDb, 'students');
        if (!studentReturn) {
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        } else {
          if (studentReturn.errno) {
            if (studentReturn.name != 'SequelizeUniqueConstraintError') {
              LOG['info']('Teacher Create Error:', studentReturn.name);
              return res.sendStatus(StatusCodes.BAD_REQUEST);
            } else {
              LOG['info'](`Teacher Create Warning: ${studentReturn.name}`);
            }
          }
        }
      });
    }

    //INSERT TCS
    if (teacher && classes && subject) {

      var tcsReturn = insert({ teacher, classes, subject }, tcsDb, 'tcs');

      if (!tcsReturn) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      } else {
        if (tcsReturn.errno) {
          if (tcsReturn.name != 'SequelizeUniqueConstraintError') {
            LOG['info']('Teacher Create Error:', tcsReturn.name);
            return res.sendStatus(StatusCodes.BAD_REQUEST);
          } else {
            LOG['info'](`Teacher Create Warning: ${tcsReturn.name}`);
          }
        }
      }

    }

    // INSERT SC
    if (students && classes) {
      students.forEach(async element => {
        var scReturn = insert({ element, classes }, scDb, 'sc');

        if (!scReturn) {
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        } else {
          if (scReturn.errno) {
            if (scReturn.name != 'SequelizeUniqueConstraintError') {
              LOG['info']('Teacher Create Error:', scReturn.name);
              return res.sendStatus(StatusCodes.BAD_REQUEST);
            } else {
              LOG['info'](`Teacher Create Warning: ${scReturn.name}`);
            }
          }
        }
      });
    }

  } catch (error) {

    //DB CONNECTION ERROR
    console.error('Unable to connect to the database:', error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  return res.sendStatus(StatusCodes.NO_CONTENT);

}

Register.post('/register', register);

export default Register;
