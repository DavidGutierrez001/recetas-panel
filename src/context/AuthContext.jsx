import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {

        const usuarioGuardado = localStorage.getItem("usuario");

        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }

    }, []);

    const iniciarSesion = (datosUsuario) => {

        setUsuario(datosUsuario);

        localStorage.setItem(
            "usuario",
            JSON.stringify(datosUsuario)
        );

    };

    const cerrarSesion = () => {

        setUsuario(null);

        localStorage.removeItem("usuario");

    };

    return (

        <AuthContext.Provider
            value={{
                usuario,
                iniciarSesion,
                cerrarSesion
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export default AuthProvider;