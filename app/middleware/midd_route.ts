import * as midd_function from "./midd_function";


export const create_order_midd = [
    midd_function.verifyHeaderAuthorization,
    midd_function.verifyHeaderContentType,
    midd_function.verifyToken,
    midd_function.verifyJWT,
    midd_function.verifyJSON,
    midd_function.verifyUser,
    midd_function.verifyRecipe
 ];