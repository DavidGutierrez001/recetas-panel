import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navegacion() {

    const { usuario, cerrarSesion } = useContext(AuthContext);

    const navigate = useNavigate();

    function salir() {

        cerrarSesion();

        navigate("/login", { replace: true });

    }

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-success">

            <div className="container-fluid">

                <NavLink
                    className="navbar-brand"
                    to="/recetas"
                >
                    Recetas_Panel
                </NavLink>

                <div className="collapse navbar-collapse show">

                    <ul className="navbar-nav ms-auto align-items-center">

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/recetas"
                            >
                                Recetas
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/favoritas"
                            >
                                Favoritas
                            </NavLink>
                        </li>

                        <li className="nav-item mx-3 text-white">

                            {usuario?.firstName}

                        </li>

                        <li className="nav-item">

                            <button
                                className="btn btn-outline-light btn-sm"
                                onClick={salir}
                            >
                                Cerrar sesión
                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Navegacion;