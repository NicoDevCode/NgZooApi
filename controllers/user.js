// Metodo para generar el token del usuario
let jwt = require('../services/jwt')
    // Modulos de node instalados
let bcrypt = require('bcrypt-nodejs')
    // Modelos de nuestra App
let User = require('../models/user')
    // Modulo para trabajar con la libreria de ficheros en nodejs
let fs = require('fs')
let path = require('path')
const pruebas = (req, res) => {
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la accion pruebas',
        user: req.user
    })
}

const saveUser = (req, res) => {
    // Crear el objeto del usuario
    let user = new User();
    // Recoger los parametros que nos llegan por la peticion
    let params = req.body;
    if (params.password && params.name && params.surname && params.email) {
        // Se le asigna valores al objeto usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({ email: user.email.toLowerCase() }, (err, isUser) => {
            if (err) {
                res.status(500).send({ message: 'Error al comprobar que el usuario existe' });
            } else {
                if (!isUser) {
                    // Cifrar la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        // Guardo el usuario en la base de datos
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al guardar el usuario' });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                                } else {
                                    res.status(200).send({ user: userStored });
                                }
                            }
                        })
                    })
                } else {

                    res.status(404).send({ message: 'El usuario no puede registrarse porque ya existe' });

                }
            }
        })

    } else {
        res.status(200).send({ message: 'Introduce los datos correctos ' });
    }
}

const login = (req, res) => {
    let params = req.body
    let email = params.email
    let password = params.password
    User.findOne({ email: email.toLowerCase() }, (err, User) => {
        if (err) {
            res.status(500).send({ message: 'Error al comprobar que el usuario existe' });
        } else {
            if (User) {
                bcrypt.compare(password, User.password, (err, check) => {
                    if (check) {
                        //Comprobamos y generamos el token
                        if (params.gettoken) {
                            //Devolver el token en caso que exista
                            res.status(200).send({
                                token: jwt.createToken(User)
                            });
                        } else {
                            res.status(200).send({ User });
                        }

                    } else {
                        res.status(404).send({ message: 'Contraseña invalida' });
                    }
                })
            } else {
                res.status(404).send({ message: 'El usuario no existe' });
            }
        }
    })
}


const updateUser = (req, res) => {
    let userId = req.params.id
    let update = req.body
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar el usuario' });
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdate) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdate });
            }
        }
    })
}

const uploadImage = (req, res) => {
    let userId = req.params.id
    let file_Name = 'No subido...'
    if (req.files) {
        let filePath = req.files.image.path
        let fileSplit = filePath.split('/')
        let fileName = fileSplit[2];
        let extSplit = fileName.split('.')
        let fileExt = extSplit[1]
        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
            if (userId != req.user.sub) {
                return res.status(500).send({ message: 'No tienes permiso para actualizar la imagen' });
            }
            User.findByIdAndUpdate(userId, { image: fileName }, { new: true }, (err, userUpdate) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar el usuario' });
                } else {
                    if (!userUpdate) {
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ user: userUpdate, image: fileName });
                    }
                }
            })
        } else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.status(404).send({ message: 'Fichero no borrado' });
                } else {
                    res.status(404).send({ message: 'Extencion no valida' });
                }
            })
        }
    } else {
        res.status(404).send({ message: 'No se ha subido fichero' });
    }
}

const getImageFile = (req, res) => {
    let imageFile = req.params.imageFile
    let pathFile = './uploads/users/' + imageFile

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile))
        } else {
            res.status(404).send({ message: 'La imagen no existe' });
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile
}