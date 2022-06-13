import * as midd_function from "./midd_function";


export const create_order_midd = [
    midd_function.verifyHeaderAuthorization,
    midd_function.verifyHeaderContentType,
    midd_function.verifyJSON
 ];