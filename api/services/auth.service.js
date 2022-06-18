import AdminModel from '../../db/models/admin.js'

const authenticate = async (req, res, next, Model) => {
    try {
        var token = req.headers["x-auth"];
        if (!token) {
            return res.json({ status: "error", message: "valid token is required" })
        }

        let instance = await Model.findByToken(token)
        console.log("instance is", instance);

        if (!instance) {
            return res.status(400).json({ status: "error", message: "valid token is required" })
        }

        req.sender = instance;
        req.token = token;
        next();
    } catch (error) {
        if (error.errmsg != null) {
            return res.status(400).json({ status: "error", message: error.errmsg })
        }
        console.log("authentication error is ", error);
        return res.status(500).json({ status: "error", message: "An error occured" })
    }
}

const authenticateAdmin = (req, res, next) => {
    console.log("Authenticating admin")
    return authenticate(req, res, next, AdminModel);
}

const AuthService = { authenticateAdmin };
export default AuthService;