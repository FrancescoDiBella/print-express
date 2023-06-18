const printer = require("pdf-to-printer"); 
const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const { Console } = require("console");

app.use(express.static('public'));
app.use(express.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specifica la cartella di destinazione per i file
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        const extension = originalname.slice(originalname.lastIndexOf('.'));
        const filename = Date.now() + extension; // Genera un nome di file univoco utilizzando il timestamp corrente
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Utilizzo
app.use(upload.single('user-file'));

app.post('/print', (req, res) => {
    setTimeout(()=>{
        const options = {
            copies: req.body.num_copies
        }
        console.log(options)
        printer.print('./uploads/'+req.file.filename, options)
            .then(()=>{
                fs.unlink('./uploads/'+req.file.filename, (err) => {
                    if (err) throw err;
                    console.log('./uploads/'+req.file.filename + 'was deleted');
                });
                res.sendStatus(200);
            });
    }, 1000);
});

app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});