import jwt from 'jsonwebtoken';

// Lets the request through only with a valid login token; saves the user's id and role in req.user
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Login required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Lets the request through only for the given roles, e.g. requireRole('Trainer'); use after requireAuth
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'You do not have access to this action' });
    }
    next();
  };
}
