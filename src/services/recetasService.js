const URL = "https://dummyjson.com/recipes?limit=12";

export async function obtenerRecetas() {

    const respuesta = await fetch(URL);

    if (!respuesta.ok) {
        throw new Error("No fue posible consultar las recetas.");
    }

    const datos = await respuesta.json();

    return datos.recipes;

}

export async function obtenerReceta(id) {

    const respuesta = await fetch(`https://dummyjson.com/recipes/${id}`);

    if (!respuesta.ok) {
        throw new Error("No fue posible consultar la receta.");
    }

    return await respuesta.json();

}