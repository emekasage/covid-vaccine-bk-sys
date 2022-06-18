import express from "express"
import * as AuthController from "./controllers/auth.controller.js"
import * as AdminController from "./controllers/admin.controller.js"
import * as HospitalController from "./controllers/hospital.controller.js"
import * as BookingController from "./controllers/booking.controller.js"
import AuthService from "./services/auth.service.js"

const router = express.Router()

// Auth routes
router.route("/admin/login").post(AuthController.adminLogin)

// Admin routes
router.route("/overview").get(AuthService.authenticateAdmin, AdminController.getOverview)

// Hospital routes
router.route("/hospitals").get(HospitalController.getHospitals)
router.route("/hospital").post(AuthService.authenticateAdmin, HospitalController.addNewHospital)
router.route("/hospital").put(AuthService.authenticateAdmin, HospitalController.editHospital)
router.route("/hospital").get(AuthService.authenticateAdmin, HospitalController.getHospital)

// Booking routes
router.route("/bookings").get(AuthService.authenticateAdmin, BookingController.getBookings)
router.route("/booking").post(BookingController.addBooking)
router.route("/booking").get(BookingController.getBooking)
router.route("/booking").put(BookingController.editBooking)
router.route("/booking").delete(BookingController.cancelBooking)

export default router
