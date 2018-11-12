// Load dependencies
const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();

const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: "AKIAIR5DHYPD2U4J5XRQ",
    accessKeyId: "YM1o9rdpWzM9qHwSaBdNEcycWfK2bFDnj4RONJMN",
    region: 'us-east-2'
});


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 's3-upload-demo-bucket',
        acl: 'public-read',
        key: function (request, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        }
    })
}).array('upload', 1);

// Views in public directory
app.use(express.static('views'));

// Main, error and success views
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.get("/success", function (request, response) {
    response.sendFile(__dirname + '/views/success.html');
});

app.get("/error", function (request, response) {
    response.sendFile(__dirname + '/views/error.html');
});

app.post('/upload', function (request, response, next) {
    upload(request, response, function (error) {
        if (error) {
            console.log(error);
            return response.redirect("/error");
        }
        console.log('File uploaded successfully.');
        response.redirect("/success");
    });
});

app.listen(3001, function () {
    console.log('Server listening on port 3001.');
});