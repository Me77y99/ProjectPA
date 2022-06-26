"use strict";
exports.__esModule = true;
exports.ErrorFactory = exports.ErrEnum = exports.BadTokenJWT = exports.UndefinedToken = exports.BadHeaderContentType = exports.HeaderAuthEmpty = exports.Unauthorized = exports.BadRequest = exports.Forbidden = exports.GenericError = void 0;
var GenericError = /** @class */ (function () {
    function GenericError() {
        this.error_code = 400;
    }
    GenericError.prototype.getMsg = function () {
        return "this is a generic error";
    };
    return GenericError;
}());
exports.GenericError = GenericError;
var Forbidden = /** @class */ (function () {
    function Forbidden() {
        this.error_code = 400;
    }
    Forbidden.prototype.getMsg = function () {
        return "no rights...";
    };
    return Forbidden;
}());
exports.Forbidden = Forbidden;
var BadRequest = /** @class */ (function () {
    function BadRequest() {
        this.error_code = 400;
    }
    BadRequest.prototype.getMsg = function () {
        return "bad bad...fix and retry...";
    };
    return BadRequest;
}());
exports.BadRequest = BadRequest;
var Unauthorized = /** @class */ (function () {
    function Unauthorized() {
        this.error_code = 400;
    }
    Unauthorized.prototype.getMsg = function () {
        return "Richiesta non autorizzata";
    };
    return Unauthorized;
}());
exports.Unauthorized = Unauthorized;
var HeaderAuthEmpty = /** @class */ (function () {
    function HeaderAuthEmpty() {
        this.error_code = 401;
    }
    HeaderAuthEmpty.prototype.getMsg = function () {
        return "Il campo autorizzazione è vuoto";
    };
    return HeaderAuthEmpty;
}());
exports.HeaderAuthEmpty = HeaderAuthEmpty;
var BadHeaderContentType = /** @class */ (function () {
    function BadHeaderContentType() {
        this.error_code = 401;
    }
    BadHeaderContentType.prototype.getMsg = function () {
        return "Il content-type della richiesta non è corretto";
    };
    return BadHeaderContentType;
}());
exports.BadHeaderContentType = BadHeaderContentType;
var UndefinedToken = /** @class */ (function () {
    function UndefinedToken() {
        this.error_code = 403;
    }
    UndefinedToken.prototype.getMsg = function () {
        return "Token non definito";
    };
    return UndefinedToken;
}());
exports.UndefinedToken = UndefinedToken;
var BadTokenJWT = /** @class */ (function () {
    function BadTokenJWT() {
        this.error_code = 401;
    }
    BadTokenJWT.prototype.getMsg = function () {
        return "Token JWT non corretto";
    };
    return BadTokenJWT;
}());
exports.BadTokenJWT = BadTokenJWT;
var ErrEnum;
(function (ErrEnum) {
    ErrEnum[ErrEnum["None"] = 0] = "None";
    ErrEnum[ErrEnum["Generic"] = 1] = "Generic";
    ErrEnum[ErrEnum["Forbidden"] = 2] = "Forbidden";
    ErrEnum[ErrEnum["BadRequest"] = 3] = "BadRequest";
    ErrEnum[ErrEnum["Unauthorized"] = 4] = "Unauthorized";
    ErrEnum[ErrEnum["HeaderAuthEmpty"] = 5] = "HeaderAuthEmpty";
    ErrEnum[ErrEnum["BadHeaderContentType"] = 6] = "BadHeaderContentType";
    ErrEnum[ErrEnum["UndefinedToken"] = 7] = "UndefinedToken";
    ErrEnum[ErrEnum["BadTokenJWT"] = 8] = "BadTokenJWT";
})(ErrEnum = exports.ErrEnum || (exports.ErrEnum = {}));
var ErrorFactory = /** @class */ (function () {
    function ErrorFactory() {
    }
    ErrorFactory.prototype.getErrorResponse = function (error_type, res) {
        return res.status(this.getError(error_type).error_code)
            .send(this.getError(error_type).getMsg());
    };
    ErrorFactory.prototype.getError = function (type) {
        var retval = null;
        switch (type) {
            case ErrEnum.Generic:
                retval = new GenericError();
                break;
            case ErrEnum.Forbidden:
                retval = new Forbidden();
                break;
            case ErrEnum.BadRequest:
                retval = new BadRequest();
                break;
            case ErrEnum.Unauthorized:
                retval = new Unauthorized();
                break;
            case ErrEnum.HeaderAuthEmpty:
                retval = new HeaderAuthEmpty();
                break;
            case ErrEnum.BadHeaderContentType:
                retval = new BadHeaderContentType();
                break;
            case ErrEnum.UndefinedToken:
                retval = new UndefinedToken();
                break;
            case ErrEnum.BadTokenJWT:
                retval = new BadTokenJWT();
                break;
        }
        return retval;
    };
    return ErrorFactory;
}());
exports.ErrorFactory = ErrorFactory;
