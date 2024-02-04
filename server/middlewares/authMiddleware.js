const jwt = require('jsonwebtoken');

const verifyToken = (expectedRole) => (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(decoded.role === expectedRole){
            if(decoded.role === 'actor'){
                req.actorId = decoded.id;
            }else if(decoded.role === 'director'){
                req.directorId = decoded.id;
            }else{
                req.adminEmail = decoded.id;
            }
            next();
        }else{
            return res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid Token'
        })
    }
}


module.exports = {
    verifyToken
}