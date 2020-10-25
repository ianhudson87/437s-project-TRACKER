import {Router} from 'express';
import * as TrackerController from './controller'

const routes = new Router();

routes.post('/users', TrackerController.createUser);
routes.get('/users', TrackerController.getAllUsers);
routes.post('/loginUser', TrackerController.loginUser);

export default routes;