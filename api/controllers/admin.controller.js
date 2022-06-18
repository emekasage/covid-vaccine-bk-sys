import BookingModel from "../../db/models/booking.js";
import HospitalModel from "../../db/models/hospital.js";

export const getOverview = async (req, res) => {
    try {
        let overview = {};
        overview.noOfBookings = await BookingModel.countDocuments({});
        overview.noOfVaccineCenters = await HospitalModel.countDocuments({});

        let noOfVaccines = 0
        let hospitals = await HospitalModel.find({})
        for(let hospital of hospitals){
            noOfVaccines+=hospital.pzifer
            noOfVaccines+=hospital.johnson
            noOfVaccines+=hospital.oxford
            noOfVaccines+=hospital.novavax
            noOfVaccines+=hospital.moderna
        }
        overview.noOfVaccines = noOfVaccines
        return res.json({ status: "success", overview });
    } catch (error) {
        console.log("Error fetching admin overview is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}