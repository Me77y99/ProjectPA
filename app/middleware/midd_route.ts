import * as midd_function from "./midd_function";

export const header_midd = [
    midd_function.verifyHeaderAuthorization,
    midd_function.verifyHeaderContentType,
    midd_function.verifyToken,
    midd_function.verifyJWT,
    midd_function.verifyJSON]

export const create_order_midd = [
    header_midd,
    midd_function.verifyUser,
    midd_function.verifyRecipe,
    midd_function.verifyFoodAvailabilityForRecipes
 ];

export const create_recipe = [
    header_midd,
    midd_function.verifyAdmin,
    midd_function.verifyRateSum,
    midd_function.verifyFoodsUnique,
    midd_function.verifyFoodsInDB,
 ];

 export const order_status = [
    header_midd,
    midd_function.verifyAdminOrThatUser
 ];

 export const update_storage = [
    header_midd,
    midd_function.verifyUser,
    midd_function.verifyFoodInDB,
    midd_function.verifyFoodAvailabilityForStorage
 ];