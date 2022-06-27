/*
FUNZIONE MIDDLEWARE PER VERIFICARE CHE IL RUOLO DELL'UTENTE SIA USER

Questa funzione viene raggiunta dalle rotte: /create-order, /check-availability, /check-availability-all e /update-storage

Verifica attraverso l'attributo user, contenente il token JWT decriptato, che il ruolo dell'utente che richiede l'operazione sia user
*/
export function verifyUser(req: any, res:any, next: any): void{
    req.user.role === "user" ? next() : next("Solo gli utenti possono effetturare la creazione di un ordine");
}

/*
FUNZIONE MIDDLEWARE PER VERIFICARE CHE IL RUOLO DELL'UTENTE SIA ADMIN

Questa funzione viene raggiunta dalla rotta /create-recipe

Verifica attraverso l'attributo user, contenente il token JWT decriptato, che il ruolo dell'utente che richiede l'operazione sia admin
*/
export function verifyAdmin(req: any, res:any, next: any): void{
    req.user.role === "admin" ? next() : next("Solo gli admin possono effetturare la creazione di una ricetta");
}