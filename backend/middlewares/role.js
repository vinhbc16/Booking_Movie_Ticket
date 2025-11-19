const { ForbiddenError } = require("../errors/custom-error");

const roleMiddleware = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError("Access denied: insufficient permission");
        }
        next();
    };
};

module.exports = roleMiddleware;
