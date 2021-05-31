import Express from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../config/database';
import Logger from '../../config/logger';

const Workload = Express.Router();
const LOG = new Logger('workload.js');

export async function getJson(dataJson) {

  try {
    let data = await sequelize.query('SELECT tcs.email, teacher.name AS teacherName, count(tcs.classCode) AS NumberOfClass, tcs.subjectCode, subject.name AS subjectName FROM tcs JOIN teacher ON teacher.email = tcs.email JOIN subject ON subject.subjectCode = tcs.subjectCode GROUP BY email, subjectCode ORDER BY email;', { type: QueryTypes.SELECT });
    var index = 0;
    let email = '';
    //CHECK DATA EXISTS
    if (data.length > 0) {

      //LOOP QUERY DATA
      data.forEach(element => {

        //DEFINE SUBJECT AND NUMBER OF CLASSES
        let subjectJson = [];
        let json = {
          subjectCode: element.subjectCode,
          subjectName: element.subjectName,
          NumberOfClasses: element.NumberOfClass
        };
        subjectJson.push(json);

        //CHECK TEACHER
        if (email != element.email) {

          //NEW TEACHER NODE
          email = element.email;
          index = dataJson.push({ [element.teacherName]: subjectJson });
        } else {

          //ADD SUBJECT TO CURRENT TEACHER
          dataJson[index - 1][element.teacherName].push(subjectJson);
        }
      });
    } else {
      //RETURN EMPTY DATA
      return 500;
    }
  } catch (e) {
    return e;
  }

}

const workload = async (req, res) => {

  //DEFINE
  let dataJson = [];

  dataJson = await getJson(dataJson);

  if (dataJson == 500) {
    return res.status(500);
  } else {
    //RETURN BODY
    LOG['info'](dataJson);
    return res.status(200).send(dataJson);
  }

}

Workload.get('/reports/workload', workload);

export default Workload;
