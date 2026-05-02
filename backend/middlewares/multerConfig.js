import multer from "multer";

const storage  = multer.memoryStorage() // keep temporary in RAM when file uploaded

const upload = multer({  // upload is middleware function that will process incoming file requests
    storage: storage,  //when file comes where should multer keep the file (memory storage)
    limits : {fileSize : 5*1024*1024}  //5mb limit
})

export default upload