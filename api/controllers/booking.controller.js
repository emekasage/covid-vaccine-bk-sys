import BookingModel from "../../db/models/booking.js";
import HospitalModel from "../../db/models/hospital.js";
import * as Utility from "../../utility.js"

const INCREMENT_CASE = 0
const DECREMENT_CASE = 1

/**
 *Fetch bookings
 */
export const getBookings = async (req, res) => {
    try {
        let bookings = await BookingModel.find({})
        return res.json({ status: "success", bookings: await addMultipleHospitalDetails(bookings) });
    } catch (error) {
        console.log("Error fetching bookings is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}

/**
 *Fetch single booking
 */
export const getBooking = async (req, res) => {
    try {
        if (Utility.isNullOrEmpty(req.query.vacId)) {
            return res.status(400).json({ status: "error", message: "vacId is required" })
        }
        let booking = await BookingModel.findOne({ vacId: req.query.vacId })
        return res.json({ status: "success", booking: await addHospitalDetails(booking) });
    } catch (error) {
        console.log("Error fetching bookings is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}

/**
 *Add a new booking
 */
export const addBooking = async (req, res) => {
    try {
        let obj = {
            name: `${req.body.firstName} ${req.body.lastName}`,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            gender: req.body.gender,
            occupation: req.body.occupation,
            dob: req.body.dob,
            idType: req.body.idType,
            dose: req.body.dose,
            vaccine: req.body.vaccine,
            date: new Date(req.body.date),
            sessionTime: req.body.sessionTime
        }

        // invalid param
        if (Utility.isNullOrEmpty(req.body.firstName) || Utility.isNullOrEmpty(req.body.lastName) || Utility.isNullOrEmpty(obj.email) || Utility.isNullOrEmpty(obj.phoneNumber)
            || Utility.isNullOrEmpty(obj.idType) || Utility.isNullOrEmpty(obj.dose) || Utility.isNullOrEmpty(obj.vaccine) || Utility.isNullOrEmpty(req.body.hospital)
            || Utility.isNullOrEmpty(req.body.date) || Utility.isNullOrEmpty(obj.sessionTime)) {
            return res.status(400).json({ status: "error", message: "firstName, lastName, email, phoneNumber, idType, dose, vaccine, hospital, date and sessionTime fields are required" });
        }

        // Get the selected hospital
        let hospital = await HospitalModel.findOne({ name: req.body.hospital })
        if (hospital == null) {
            return res.status(400).json({ status: "error", message: `Hospital with name ${req.body.hospital} not found on the system` });
        }

        // Users can only book a particular dose once
        let existingBooking = await BookingModel.findOne({ name: obj.name, dose: obj.dose })
        if (existingBooking) {
            existingBooking = await addHospitalDetails(existingBooking);
            return res.status(400).json({ status: "error", message: `You have already booked your ${existingBooking.dose} at ${existingBooking.hospital}` });
        }

        obj.hospitalId = hospital._id
        obj.vacId = await Utility.generateVacId()

        let booking = new BookingModel(obj);
        await booking.save()

        // update hospital inventory
        await updateInventory(hospital, obj.vaccine, DECREMENT_CASE)

        return res.json({ status: "success", message: `Successfully booked a vaccination appointment at ${req.body.hospital}`, booking: await addHospitalDetails(booking) });

    } catch (error) {
        console.log("Error creating new booking is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}

/**
 *Edit an existing booking
 */
export const editBooking = async (req, res) => {
    try {
        let obj = {
            vacId: req.body.vacId,
            dose: req.body.dose,
            vaccine: req.body.vaccine,
            date: new Date(req.body.date),
            sessionTime: req.body.sessionTime
        }

        // invalid param
        if (Utility.isNullOrEmpty(obj.vacId) || Utility.isNullOrEmpty(obj.dose) || Utility.isNullOrEmpty(obj.vaccine) || Utility.isNullOrEmpty(req.body.hospital)
            || Utility.isNullOrEmpty(req.body.date) || Utility.isNullOrEmpty(obj.sessionTime)) {
            return res.status(400).json({ status: "error", message: "vacId, dose, vaccine, hospital, date and sessionTime fields are required" });
        }

        // Get the selected hospital
        let hospital = await HospitalModel.findOne({ name: req.body.hospital })
        if (hospital == null) {
            return res.status(400).json({ status: "error", message: `Hospital with name ${req.body.hospital} not found on the system` });
        }

        // Fetch the booking to edit
        let previousBooking = await BookingModel.findOne({ vacId: obj.vacId })
        if (previousBooking == null) {
            return res.status(400).json({ status: "error", message: `No booking exists with the vacId: ${obj.vacId}` });
        }

        // Users can only book a particular dose once
        let existingBooking = await BookingModel.findOne({ name: obj.name, dose: obj.dose, vacId: { $ne: obj.vacId } })
        if (existingBooking) {
            existingBooking = await addHospitalDetails(existingBooking);
            return res.status(400).json({ status: "error", message: `You have already booked your ${existingBooking.dose} at ${existingBooking.hospital}` });
        }

        // return previous vaccine
        await updateInventory(hospital, previousBooking.vaccine, INCREMENT_CASE)

        // update details
        previousBooking.hospitalId = hospital._id
        previousBooking.dose = obj.dose
        previousBooking.vaccine = obj.vaccine
        previousBooking.date = obj.date
        previousBooking.sessionTime = obj.sessionTime
        await previousBooking.save()

        // update hospital inventory
        await updateInventory(hospital, obj.vaccine, DECREMENT_CASE)

        return res.json({ status: "success", message: `Successfully edited booking with vacId ${obj.vacId}`, booking: await addHospitalDetails(previousBooking) });

    } catch (error) {
        console.log("Error editing booking is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}

/**
 *Edit an existing booking
 */
export const cancelBooking = async (req, res) => {
    try {
        let vacId = req.query.vacId

        // invalid param
        if (Utility.isNullOrEmpty(vacId)) {
            return res.status(400).json({ status: "error", message: "vacId field is required" });
        }

        // Fetch the booking to cancel
        let previousBooking = await BookingModel.findOne({ vacId })
        if (previousBooking == null) {
            return res.status(400).json({ status: "error", message: `No booking exists with the vacId: ${vacId}` });
        }

        let hospital = await HospitalModel.findById(previousBooking.hospitalId)

        // return previous vaccine
        await updateInventory(hospital, previousBooking.vaccine, INCREMENT_CASE)

        await BookingModel.deleteOne({ vacId })
        return res.json({ status: "success", message: `Booking with vacId ${vacId} was successfully canceled` });
    } catch (error) {
        console.log("Error canceling booking is", error);
        return res.status(500).json({ status: "error", message: "An error occured" });
    }
}


/**
 * Fetch and Add hospital details to a single booking
 * @param {*} booking 
 */
const addHospitalDetails = async (booking) => {
    try {
        let buffedBooking = booking.toObject()
        let hospital = await HospitalModel.findById(buffedBooking.hospitalId);
        buffedBooking.hospital = hospital.name
        buffedBooking.facilityId = hospital.facilityId
        buffedBooking.state = hospital.state
        buffedBooking.lga = hospital.lga

        return buffedBooking
    } catch (error) {
        console.log("Error attaching hospital details to single booking is ", error)
        return null
    }

}

/**
 * Fetch and Add hospital details to bookings
 * @param {*} bookings 
 */
const addMultipleHospitalDetails = async (bookings) => {
    let buffedBookings = []
    for (let booking of bookings) {
        buffedBookings.push(await addHospitalDetails(booking))
    }
    return buffedBookings
}

const updateInventory = async (hospital, vaccine, updateCase) => {
    switch (vaccine) {
        case "Pzifer": if (updateCase == INCREMENT_CASE) {
            hospital.pzifer++
        }
        else {
            if (hospital.pzifer > 0) {
                hospital.pzifer--
            }
        }
        break

        case "Johnson & Johnson": if (updateCase == INCREMENT_CASE) {
            hospital.johnson++
        }
        else {
            if (hospital.johnson > 0) {
                hospital.johnson--
            }
        }
        break

        case "Moderna": if (updateCase == INCREMENT_CASE) {
            hospital.moderna++
        }
        else {
            if (hospital.moderna > 0) {
                hospital.moderna--
            }
        }
        break

        case "Novavax": if (updateCase == INCREMENT_CASE) {
            hospital.novavax++
        }
        else {
            if (hospital.novavax > 0) {
                hospital.novavax--
            }
        }
        break

        case "Oxford": if (updateCase == INCREMENT_CASE) {
            hospital.oxford++
        }
        else {
            if (hospital.oxford > 0) {
                hospital.oxford--
            }
        }
        break
    }
    await hospital.save()
    return
}