let express = require('express')
let UserController = require('../controllers/user')
let md_auth = require('../middelware/authenticated')
let api = express.Router();

let multiparty = require('connect-multiparty')
let md_upload = multiparty({ uploadDir: './uploads/users' })

api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas)
api.post('/register', UserController.saveUser)
api.post('/login', UserController.login)
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser)
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage)
api.get('/get-image-file/:imageFile', UserController.getImageFile)
module.exports = api;