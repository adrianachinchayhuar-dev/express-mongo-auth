import express from 'express';

// Rutas que devuelven las páginas HTML (EJS).
// La protección por rol de las páginas se hace en el cliente (public/js/common.js)
// y la seguridad real de los datos la hacen authenticate/authorize en /api.
const router = express.Router();

router.get('/', (req, res) => res.redirect('/signIn'));
router.get('/signIn', (req, res) => res.render('signIn', { title: 'Iniciar sesión' }));
router.get('/signUp', (req, res) => res.render('signUp', { title: 'Registro' }));
router.get('/profile', (req, res) => res.render('profile', { title: 'Mi cuenta' }));
router.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Dashboard' }));
router.get('/admin', (req, res) => res.render('admin', { title: 'Panel de administración' }));
router.get('/403', (req, res) => res.status(403).render('403', { title: 'Acceso denegado' }));

export default router;
