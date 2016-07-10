var router = require('express').Router();
var routers = require('./index');

module.exports = router;

router.use('/admin', routers.admin);
router.use('/login', routers.login);
router.use('/registro', routers.registro);
router.use('/usuario', routers.usuario);
