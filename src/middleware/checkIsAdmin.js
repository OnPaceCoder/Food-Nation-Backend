
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        return res.status(401).json({ error: "Not authorized as an admin" });
    }
}


module.exports = { isAdmin };