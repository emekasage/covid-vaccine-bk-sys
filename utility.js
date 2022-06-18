import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import BookingModel from './db/models/booking.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Space a date string
 * @param {*} dateString 
 * @returns spaced dateString
 */
const spaceDate = (dateString) => {
    return dateString.replace(/-/g, ' - ');
}

//removes sensitive information
const expose = (instance) => {
    let obj = instance.toObject();
    let sensitiveFields = ["password"];
    for (let field of sensitiveFields) {
        delete obj[field];
    }
    return obj;
}

export const getTodaysDate = () => {
    let temp = new Date().toJSON();
    return new Date(temp.substring(0, 10));
}

export const saveBase64File = (fileString, extension, fileType, id, subdir) => {
    let base64Data = fileString.replace(`data:${fileType};base64,`, "");
    let dir = path.join(__dirname, `../frontend/public/${subdir}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    let filename = path.join(__dirname, `../frontend/public/${subdir}${id}.${extension}`);
    fs.writeFileSync(filename, base64Data, 'base64');
}

// returns binary image
export const loadImage = async (imageName, fileType) => {
    let filename = path.join(__dirname, `../frontend/public/images/profiles/${imageName}`);
    const contents = fs.readFileSync(filename, { encoding: 'base64' });
    return getBinary(contents, 0, fileType);
}

function getBinary(encodedFile, type, fileType) {
    var base64Image;
    if (type == 1) {
        base64Image = encodedFile.split(`data:${fileType};base64,`)[1];
    }
    else {
        base64Image = encodedFile;
    }

    var binaryImg = atob(base64Image);
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
        ua[i] = binaryImg.charCodeAt(i);
    }

    return ab;
}

/**
 * check if a string is null or empty
 */
export function isNullOrEmpty(val) {
    if (val == null || val == undefined) {
        return true
    }
    if (typeof (val) === "string") {
        if (val.trim() == "") {
            return true
        }
    }
    return false
}

/**
 * Get a new vacId
 * @returns 
 */
export async function generateVacId() {
    let vacId
    while (isNullOrEmpty(vacId) || await isExistingId(vacId)) {
        vacId = generateId()
    }
    return vacId
}

/**
 * Generate random vacId
 */
function generateId() {
    return "NG-" + Math.random().toString(36).slice(2).toUpperCase()
}

async function isExistingId(vacId) {
    let existingBooking = await BookingModel.findOne({ vacId });
    return existingBooking != null
}