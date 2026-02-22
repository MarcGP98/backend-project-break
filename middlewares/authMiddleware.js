function authMiddleware(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }

  const msg = encodeURIComponent('No tienes acceso. Inicia sesión.');
  return res.redirect(`/login?msg=${msg}`);
}

module.exports = authMiddleware;