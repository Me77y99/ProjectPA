"use strict";
exports.__esModule = true;
exports.verifyAdmin = exports.verifyUser = void 0;
/*
FUNZIONE MIDDLEWARE PER VERIFICARE CHE IL RUOLO DELL'UTENTE SIA USER

Questa funzione viene raggiunta dalle rotte: /create-order, /check-availability, /check-availability-all e /update-storage

Verifica attraverso l'attributo user, contenente il token JWT decriptato, che il ruolo dell'utente che richiede l'operazione sia user
*/
function verifyUser(req, res, next) {
    req.user.role === "user" ? next() : next("Solo gli utenti possono effetturare la creazione di un ordine");
}
exports.verifyUser = verifyUser;
/*
FUNZIONE MIDDLEWARE PER VERIFICARE CHE IL RUOLO DELL'UTENTE SIA ADMIN

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica attraverso l'attributo user, contenente il token JWT decriptato, che il ruolo dell'utente che richiede l'operazione sia admin
*/
function verifyAdmin(req, res, next) {
    req.user.role === "admin" ? next() : next("Solo gli admin possono effetturare la creazione di una ricetta");
}
exports.verifyAdmin = verifyAdmin;
