import {Router} from 'express';
import * as TrackerController from './controller'

const routes = new Router();

routes.post('/users', TrackerController.createUser);
routes.get('/users', TrackerController.getAllUsers);
routes.post('/groups', TrackerController.createGroup)
routes.get('/groups', TrackerController.getAllGroups)

routes.get('/joinGroup', TrackerController.joinGroup)

export default routes;