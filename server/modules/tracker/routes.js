import {Router} from 'express';
import * as TrackerController from './controller'

const routes = new Router();

routes.post('/users', TrackerController.createUser)
routes.get('/users', TrackerController.getAllUsers)

routes.post('/groups', TrackerController.createGroup)
routes.get('/groups', TrackerController.getAllGroups)

routes.post('/getGroupByID', TrackerController.getGroupByID)

routes.post('/joinGroup', TrackerController.joinGroup)

routes.post('/loginUser', TrackerController.loginUser)

routes.post('/getUser', TrackerController.getUser)

export default routes;