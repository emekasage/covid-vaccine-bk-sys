import HospitalModel from "../../db/models/hospital.js";
import * as Utility from "../../utility.js"

/**
 *Fetch hospitals by lga or no filter
 */
export const getHospitals = async (req, res) => {
    try {
        let hospitals = []
        if (req.query.lga != null) {
            console.log("Here")
            hospitals = await HospitalModel.find({ lga: { $regex: new RegExp("^" + req.query.lga.toLowerCase(), "i") } })
        }
        else {
            hospitals = await HospitalModel.find({});
        }
        return res.json({ status: "success", hospitals });
    } catch (error) {
        console.log("Error fetching hospitals is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}

/**
 *Add a new hospital
 */
export const addNewHospital = async (req, res) => {
    try {
        let obj = {
            name: req.body.name,
            facilityId: req.body.facilityId,
            state: req.body.state,
            lga: req.body.lga
        }

        // invalid param
        if (Utility.isNullOrEmpty(obj.name) || Utility.isNullOrEmpty(obj.facilityId) || Utility.isNullOrEmpty(obj.state) || Utility.isNullOrEmpty(obj.lga)) {
            return res.status(400).json({ status: "error", message: "name, facilityId, state and lga fields are required" });
        }

        // hospital unique details
        let existingHospital = await HospitalModel.find({ $or: [{ name: obj.name }, { facilityId: obj.facilityId }] })
        if (existingHospital.length != 0) {
            return res.status(400).json({ status: "error", message: "Hospital name and facilityId must be unique" });
        }

        let hospital = new HospitalModel(obj);
        await hospital.save()
        return res.json({ status: "success", hospital });

    } catch (error) {
        console.log("Error creating new hospital is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}

/**
 * Edit hospital or hospital inventory
 */
export const editHospital = async (req, res) => {
    try {
        let obj = {
            facilityId: req.body.facilityId,
            name: req.body.name,
            state: req.body.state,
            lga: req.body.lga,
            pzifer: req.body.pzifer,
            moderna: req.body.moderna,
            johnson: req.body.johnson,
            novavax: req.body.novavax,
            oxford: req.body.oxford,
        }
        if (Utility.isNullOrEmpty(obj.facilityId) || Utility.isNullOrEmpty(obj.name) || Utility.isNullOrEmpty(obj.state) || Utility.isNullOrEmpty(obj.lga) ||
            Utility.isNullOrEmpty(obj.pzifer) || Utility.isNullOrEmpty(obj.moderna) || Utility.isNullOrEmpty(obj.johnson) || Utility.isNullOrEmpty(obj.novavax) ||
            Utility.isNullOrEmpty(obj.oxford)) {
            return res.status(400).json({ status: "error", message: "facilityId, name, state, lga, pzifer, moderna, johnson, novavax and oxford fields are required" });
        }

        let hospital = await HospitalModel.findOne({ facilityId: obj.facilityId })
        if (hospital == null) {
            return res.status(400).json({ status: "error", message: `Hospital with facilityId ${obj.facilityId} not found` });
        }

        // update hospital details
        hospital.name = obj.name
        hospital.state = obj.state
        hospital.lga = obj.lga
        hospital.pzifer = obj.pzifer
        hospital.johnson = obj.johnson
        hospital.moderna = obj.moderna
        hospital.novavax = obj.novavax
        hospital.oxford = obj.oxford
        await hospital.save()

        return res.json({ status: "success", message: "Hospital successfully edited", hospital });
    } catch (error) {
        console.log("Error editing hospital is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}


/**
 *Fetch hospitals by facilityId
 */
 export const getHospital = async (req, res) => {
    try {
        if (Utility.isNullOrEmpty(req.query.facilityId)) {
            return res.status(400).json({ status: "error", message: `facilityId field is required` });
        }

        let hospital = await HospitalModel.findOne({ facilityId: req.query.facilityId })
        if (hospital == null) {
            return res.status(400).json({ status: "error", message: `Hospital with facilityId ${req.query.facilityId} not found` });
        }
       
        return res.json({ status: "success", hospital });
    } catch (error) {
        console.log("Error fetching hospital is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}

