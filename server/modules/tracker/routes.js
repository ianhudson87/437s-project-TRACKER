import {Router} from 'express';
import * as TrackerController from './controller'

const routes = new Router();

routes.post('/users', TrackerController.createUser)
routes.get('/users', TrackerController.getAllUsers)

routes.post('/groups', TrackerController.createGroup)
routes.get('/groups', TrackerController.getAllGroups)

routes.post('/getObjectByID', TrackerController.getObjectByID)

routes.post('/joinGroup', TrackerController.joinGroup)

routes.post('/loginUser', TrackerController.loginUser)

routes.post('/getUser', TrackerController.getUser)
routes.post('/createGame', TrackerController.createGame)
routes.get('/games', TrackerController.getAllGames)

routes.post('/changeScore', TrackerController.changeScore)

export default routes;