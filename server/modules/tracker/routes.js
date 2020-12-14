import {Router} from 'express';
import { TrackerRoutes } from '.';
import * as TrackerController from './controller'

const routes = new Router();

//Users
routes.post('/users', TrackerController.createUser)
routes.post('/createPendingUser', TrackerController.createPendingUser)
routes.get('/users', TrackerController.getAllUsers)

routes.post('/loginUser', TrackerController.loginUser)

routes.post('/getUser', TrackerController.getUser)

routes.post('/verifyEmail', TrackerController.verifyEmail)

routes.post('/addInfo', TrackerController.addInfo)

//Groups
routes.post('/groups', TrackerController.createGroup)
routes.get('/groups', TrackerController.getAllGroups)

routes.post('/getObjectByID', TrackerController.getObjectByID)
routes.post('/getObjectsByIDs', TrackerController.getObjectsByIDs)
routes.post('/searchObjectsByString', TrackerController.searchObjectsByString)

routes.post('/joinGroup', TrackerController.joinGroup)

//Games
routes.post('/games', TrackerController.createGame)
routes.get('/games', TrackerController.getAllGames)


routes.post('/getGameByID', TrackerController.getGameByID)

routes.post('/games', TrackerController.joinGame)

routes.post('/getUser', TrackerController.getUser)
routes.post('/createGame', TrackerController.createGame)
routes.post('/createPendingGame', TrackerController.createPendingGame)
routes.post('/getPendingGamesOfUser', TrackerController.getPendingGamesOfUser)
routes.post('/acceptGame', TrackerController.acceptGame)

routes.get('/games', TrackerController.getAllGames)

routes.post('/changeScore', TrackerController.changeScore)

routes.post('/addFriend', TrackerController.addFriend)

routes.post('/checkFriends', TrackerController.checkFriends)

routes.post('/moveToNextRound', TrackerController.moveToNextRound)


export default routes;