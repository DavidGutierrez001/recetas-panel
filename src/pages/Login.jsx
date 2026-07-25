import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login } from "../services/authService";

function Login() {

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const { iniciarSesion } = useContext(AuthContext);

    const navigate = useNavigate();

    async function manejarLogin(e) {

        e.preventDefault();

        setError("");

        if (!usuario || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {

            setCargando(true);

            const datos = await login(usuario, password);

            iniciarSesion(datos);

            navigate("/recetas");

        } catch {

            setError("Usuario o contraseña incorrectos.");

        } finally {

            setCargando(false);

        }

    }

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                Recetas_Panel
                            </h2>

                            <p className="text-center text-muted">
                                Usuario: emilys<br />
                                Contraseña: emilyspass
                            </p>

                            <form onSubmit={manejarLogin}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Usuario
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Contraseña
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                </div>

                                {
                                    error &&
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                }

                                <button
                                    className="btn btn-success w-100"
                                    disabled={cargando}
                                >

                                    {
                                        cargando
                                            ? "Ingresando..."
                                            : "Iniciar sesión"
                                    }

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;