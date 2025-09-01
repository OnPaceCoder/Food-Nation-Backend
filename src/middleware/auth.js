require("dotenv").config();
const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {

    let token;

    token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorised: Token is invalid or not found in cookies" });
    }

    // Checking validity of Token
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;

        next();
    } catch (err) {
        console.log(
            `JWT verification failed at URL ${req.url}`,
            err.name,
            err.message
        );
        return res.sendStatus(401).json({ error: "Invalid token" });
    }
};




module.exports = { authJWT };