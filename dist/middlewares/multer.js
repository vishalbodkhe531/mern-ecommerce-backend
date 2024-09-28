import multer from "multer";
import { v4 as uuid } from "uuid"; // here v4 is a method uuid generate uniqueId
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const id = uuid();
        const extName = file.originalname.split(".").pop(); /// It's for unique photo
        callback(null, `${id}.${extName}`);
    },
});
export const singleUpload = multer({ storage }).single("photo");
