var express = require('express');
var router = express.Router();


/* post upload users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body.email);
    console.log(req.body.password);

    if(req.body.email == "" || req.body.password == ""){
        res.status(404).send("your gay!");
    }else{
        if(req.body.email == req.body.password){
            res.send("welcome! you in");
        }else{
            res.send("lmao wrong bitch");
        }
    }
    
});

module.exports = router;