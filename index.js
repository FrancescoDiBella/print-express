const printer = require("pdf-to-printer"); 
const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');

app.use(express.static('public'));
app.use(express.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/'); // Specifica la cartella di destinazione per i file
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
        const command = 'lp -d DCP197C -n '+options.copies+' ./public/uploads/'+req.file.filename;
        exec(command, (error, stdout, stderr) => {
            fs.unlink('./public/uploads/'+req.file.filename, (err) => {
                if (err) 
                console.log('./public/uploads/'+req.file.filename + 'was deleted');
            });
            if (error) {
              console.error(`exec error: ${error}`);
              throw error;
            }
            res.sendStatus(200);
        });
    }, 500);
});

app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});