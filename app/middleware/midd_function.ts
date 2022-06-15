const jwt = require('jsonwebtoken');

export function verifyHeaderAuthorization (req: any, res:any, next: any): void{
    req.headers.authorization ? next() : next("Il campo autorizzazione non è presente nella intestazione");
}

export function verifyHeaderContentType(req: any, res:any, next: any): void{
    req.headers["content-type"] == "application/json" ? next() : next("Il content-type della richiesta non è corretto");
}

export function verifyToken(req: any, res:any, next: any): void{
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader!=='undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

export function verifyJWT(req: any, res:any, next: any): void{
    let decoded = jwt.verify(req.token, 'mysupersecretkey');
  if(decoded !== null)
    req.user = decoded;
    next()
}

export function verifyJSON(req: any, res:any, next: any): void{
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
    } catch (error) { 
        console.log(error);
        next();
    }
}

//verifica JWT
//verifica ricetta 
//verifica disponibilità foods