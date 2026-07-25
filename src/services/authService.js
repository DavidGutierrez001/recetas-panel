const URL = "https://dummyjson.com/auth/login";

export async function login(usuario, contraseña) {

    const respuesta = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: usuario,
            password: contraseña,
            expiresInMins: 30
        })
    });

    if (!respuesta.ok) {
        throw new Error("Usuario o contraseña incorrectos");
    }

    return await respuesta.json();

}