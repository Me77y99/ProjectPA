const jwt = require('jsonwebtoken');

var myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
  };
/* 
  var requestTime = function (req, res, next) {
      req.requestTime = Date.now();
      next();
    };
  
  var checkHeader = function(req, res, next){
      const authHeader = req.headers.authorization;
      if (authHeader) {
          next();
      }else{
          next("no auth header");
      }
  };
  
  var checkHeader = function(req, res, next){
      const authHeader = req.headers.authorization;
      if (authHeader) {
          next();
      }else{
          let err = new Error("ahi ahi no auth header");
          next(err);
      }
  };
  
  function checkToken(req,res,next){
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader!=='undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
  }
  
  function verifyAndAuthenticate(req,res,next){
    let decoded = jwt.verify(req.token, 'mysupersecretkey');
    if(decoded !== null)
      req.user = decoded;
      next();
  }
  
  function logErrors(err, req, res, next) {
      console.error(err.stack);
      next(err);
    }
  
  function errorHandler(err, req, res, next) {   
      res.status(500).send({"error": err.message});
  }
  */
    
  