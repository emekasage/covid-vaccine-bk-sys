import AdminModel from '../../db/models/admin.js'

export const adminLogin = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let admin;

        admin = await AdminModel.findOne({ email: email });
        if (!admin) {
            return res.status(200).json({ status: "error", message: `Admin with email ${email} does not exist` })
        }

        // account exists, check password
        admin = await AdminModel.findByCredentials(email, password);
        if (!admin) {
            return res.status(200).json({ status: "error", message: `Password is incorrect` })
        }

        let token = await admin.generateAuthToken();
        return res.json({ status: "success", token, message: "Logged in successfully", admin });
    } catch (error) {
        console.log("Error signing in admin is", error)
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}