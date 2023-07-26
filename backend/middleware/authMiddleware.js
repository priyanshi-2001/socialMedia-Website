import jwt from 'jsonwebtoken';

export const  authorize=(req, res, next)=>{
  const authHeader = req.headers['authorization'];
  console.log("pp",process.env.API_KEY)

  if (authHeader) {
    const [scheme, token] = authHeader.split(' ');

    if (token && scheme.toLowerCase() === 'bearer') {
      try {
        const decoded = jwt.verify(token, process.env.API_KEY);

        req.user = decoded;

        return next();
      } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
  }


  return res.status(401).json({ error: 'Authentication required' });
}
