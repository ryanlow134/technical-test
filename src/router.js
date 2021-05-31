import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController';
import Register from './controllers/register';
import Workload from './controllers/reports/workload';

const router = Express.Router();

router.use('/', HealthcheckController);
router.use('/', Register);
router.use('/', Workload);

export default router;
