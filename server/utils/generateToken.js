const jwt = require('jsonwebtoken');

const generateToken = (res,id,role) => {
    const token = jwt.sign(
        {id,role},
        process.env.JWT_SECRET_KEY,
        {expiresIn : "30d"}
    )
    return token;
}


module.exports = {
    generateToken
}