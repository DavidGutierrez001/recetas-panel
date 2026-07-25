// =============
// Archivo AuthContext.jsx

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

// =============
// Reemplazar el main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import App from './App.jsx'
import AuthProvider from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// ===========
// AuthService.js

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

// ===========
// Reemplazar el login
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

// ==================
// Crear en components 
// RutaProtegida.jsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RutaProtegida({ children }) {

    const { usuario } = useContext(AuthContext);

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;

}

export default RutaProtegida;

// ==================
// reemplazar App.jsx

import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Recetas from "./pages/Recetas";
import DetalleReceta from "./pages/DetalleReceta";
import Favoritas from "./pages/Favoritas";
import NoEncontrada from "./pages/NoEncontrada";

import RutaProtegida from "./components/RutaProtegida";

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/recetas"
                element={
                    <RutaProtegida>
                        <Recetas />
                    </RutaProtegida>
                }
            />

            <Route
                path="/recetas/:id"
                element={
                    <RutaProtegida>
                        <DetalleReceta />
                    </RutaProtegida>
                }
            />

            <Route
                path="/favoritas"
                element={
                    <RutaProtegida>
                        <Favoritas />
                    </RutaProtegida>
                }
            />

            <Route
                path="*"
                element={<NoEncontrada />}
            />

        </Routes>

    );

}

export default App;


// en components
// crear Navegacion.jsx
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


// ==========

// reemplazar recetas.jsx
import Navegacion from "../components/Navegacion";

function Recetas() {

    return (

        <>
            <Navegacion />

            <div className="container mt-4">

                <h1>Recetas Disponibles</h1>

            </div>
        </>

    );

}

export default Recetas;

// ============
// Reemplazar DetalleReceta.jsx;
import Navegacion from "../components/Navegacion";

function DetalleReceta() {

    return (

        <>
            <Navegacion />

            <div className="container mt-4">

                <h1>Detalle de la receta</h1>

            </div>
        </>

    );

}

export default DetalleReceta;


// =====================
// reemplazar Favoritas.jsx
import Navegacion from "../components/Navegacion";

function Favoritas() {

    return (

        <>
            <Navegacion />

            <div className="container mt-4">

                <h1>Mis recetas favoritas</h1>

            </div>
        </>

    );

}

export default Favoritas;


// =======
// Crear recetasService.js
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


// ====================
// Reemplazar recetas 
import { useEffect, useState } from "react";
import Navegacion from "../components/Navegacion";
import { obtenerRecetas } from "../services/recetasService";

function Recetas() {

    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function cargarRecetas() {

            try {

                const datos = await obtenerRecetas();
                setRecetas(datos);

            } catch {

                setError("No fue posible cargar las recetas.");

            } finally {

                setCargando(false);

            }

        }

        cargarRecetas();

    }, []);

    if (cargando) {
        return (
            <>
                <Navegacion />
                <div className="container mt-4">
                    <h3>Cargando recetas...</h3>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navegacion />
                <div className="container mt-4">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </>
        );
    }

    return (

        <>
            <Navegacion />

            <div className="container mt-4">

                <h2 className="mb-4">
                    Recetas Disponibles
                </h2>

                <div className="row">

                    {
                        recetas.map((receta) => (

                            <div
                                key={receta.id}
                                className="col-md-4 mb-4"
                            >

                                <div className="card h-100">

                                    <img
                                        src={receta.image}
                                        className="card-img-top"
                                        alt={receta.name}
                                    />

                                    <div className="card-body">

                                        <h5>{receta.name}</h5>

                                        <p>
                                            Cocina: {receta.cuisine}
                                        </p>

                                        <p>
                                            Calificación: {receta.rating}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))
                    }

                </div>

            </div>

        </>

    );

}

export default Recetas;

// ===========
// En components
// crear TarjetaReceta.jsx

function TarjetaReceta({ receta }) {

    return (

        <div className="card h-100">

            <img
                src={receta.image}
                className="card-img-top"
                alt={receta.name}
            />

            <div className="card-body d-flex flex-column">

                <h5 className="card-title">
                    {receta.name}
                </h5>

                <p className="card-text mb-2">
                    <strong>Cocina:</strong> {receta.cuisine}
                </p>

                <p className="card-text">
                    <strong>Calificación:</strong> {receta.rating}
                </p>

                <div className="mt-auto d-flex gap-2">

                    <button className="btn btn-success flex-fill">
                        Ver detalle
                    </button>

                    <button className="btn btn-warning flex-fill">
                        Favorita
                    </button>

                </div>

            </div>

        </div>

    );

}

export default TarjetaReceta;

// reemplazar nuevamente Recetas.jsx 


import { useEffect, useState } from "react";
import Navegacion from "../components/Navegacion";
import TarjetaReceta from "../components/TarjetaReceta";
import { obtenerRecetas } from "../services/recetasService";

function Recetas() {

    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function cargarRecetas() {

            try {

                const datos = await obtenerRecetas();
                setRecetas(datos);

            } catch {

                setError("No fue posible cargar las recetas.");

            } finally {

                setCargando(false);

            }

        }

        cargarRecetas();

    }, []);

    if (cargando) {

        return (
            <>
                <Navegacion />
                <div className="container mt-4">
                    <h3>Cargando recetas...</h3>
                </div>
            </>
        );

    }

    if (error) {

        return (
            <>
                <Navegacion />
                <div className="container mt-4">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </>
        );

    }

    return (

        <>
            <Navegacion />

            <div className="container mt-4">

                <h2 className="mb-4">
                    Recetas Disponibles
                </h2>

                <div className="row">

                    {
                        recetas.map((receta) => (

                            <div
                                key={receta.id}
                                className="col-md-4 mb-4"
                            >

                                <TarjetaReceta receta={receta} />

                            </div>

                        ))
                    }

                </div>

            </div>

        </>

    );

}

export default Recetas;


// ====================

// Reemplzar Tarjeta receta para hacer el detalle 
import { Link } from "react-router-dom";

function TarjetaReceta({ receta }) {

    return (

        <div className="card h-100">

            <img
                src={receta.image}
                className="card-img-top"
                alt={receta.name}
            />

            <div className="card-body d-flex flex-column">

                <h5 className="card-title">
                    {receta.name}
                </h5>

                <p className="card-text mb-2">
                    <strong>Cocina:</strong> {receta.cuisine}
                </p>

                <p className="card-text">
                    <strong>Calificación:</strong> {receta.rating}
                </p>

                <div className="mt-auto d-flex gap-2">

                    <Link
                        to={`/recetas/${receta.id}`}
                        className="btn btn-success flex-fill"
                    >
                        Ver detalle
                    </Link>

                    <button className="btn btn-warning flex-fill">
                        Favorita
                    </button>

                </div>

            </div>

        </div>

    );

}

export default TarjetaReceta;

// ================
// Y reemplazar detalle receta nuevamente por 

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import { obtenerReceta } from "../services/recetasService";

function DetalleReceta() {

    const { id } = useParams();

    const [receta, setReceta] = useState(null);

    useEffect(() => {

        async function cargarReceta() {

            const datos = await obtenerReceta(id);
            setReceta(datos);

        }

        cargarReceta();

    }, [id]);

    if (!receta) {

        return (
            <>
                <Navegacion />

                <div className="container mt-4">
                    <h3>Cargando receta...</h3>
                </div>
            </>
        );

    }

    return (

        <>
            <Navegacion />

            <div className="container mt-4">

                <h2 className="mb-4">
                    {receta.name}
                </h2>

                <img
                    src={receta.image}
                    alt={receta.name}
                    className="img-fluid rounded mb-4"
                    style={{ maxWidth: "500px" }}
                />

                <p>
                    <strong>Cocina:</strong> {receta.cuisine}
                </p>

                <p>
                    <strong>Dificultad:</strong> {receta.difficulty}
                </p>

                <p>
                    <strong>Tiempo de preparación:</strong> {receta.prepTimeMinutes} minutos
                </p>

                <p>
                    <strong>Porciones:</strong> {receta.servings}
                </p>

                <h4 className="mt-4">
                    Ingredientes
                </h4>

                <ul>

                    {
                        receta.ingredients.map((ingrediente, index) => (

                            <li key={index}>
                                {ingrediente}
                            </li>

                        ))
                    }

                </ul>

                <Link
                    to="/recetas"
                    className="btn btn-secondary mt-3"
                >
                    Volver
                </Link>

            </div>

        </>

    );

}

export default DetalleReceta;

// ===========
// Reemplazar tarjeta receta por 
import { Link } from "react-router-dom";

function TarjetaReceta({ receta, eliminarFavorita }) {

    function guardarFavorita() {

        const favoritas =
            JSON.parse(localStorage.getItem("favoritas")) || [];

        const existe = favoritas.some(
            (favorita) => favorita.id === receta.id
        );

        if (existe) {
            alert("Esta receta ya está guardada como favorita.");
            return;
        }

        favoritas.push(receta);

        localStorage.setItem(
            "favoritas",
            JSON.stringify(favoritas)
        );

        alert("Receta guardada como favorita.");

    }

    return (

        <div className="card h-100">

            <img
                src={receta.image}
                className="card-img-top"
                alt={receta.name}
            />

            <div className="card-body d-flex flex-column">

                <h5 className="card-title">
                    {receta.name}
                </h5>

                <p className="card-text">
                    <strong>Cocina:</strong> {receta.cuisine}
                </p>

                <p className="card-text">
                    <strong>Calificación:</strong> {receta.rating}
                </p>

                <div className="mt-auto d-flex gap-2">

                    <Link
                        to={`/recetas/${receta.id}`}
                        className="btn btn-success flex-fill"
                    >
                        Ver detalle
                    </Link>

                    {
                        eliminarFavorita ? (

                            <button
                                className="btn btn-danger flex-fill"
                                onClick={() => eliminarFavorita(receta.id)}
                            >
                                Eliminar
                            </button>

                        ) : (

                            <button
                                type="button"
                                className="btn btn-warning flex-fill"
                                onClick={guardarFavorita}
                            >
                                Favorita
                            </button>

                        )
                    }

                </div>

            </div>

        </div>

    );

}

export default TarjetaReceta;

// ============
// favoritas por 
import { useEffect, useState } from "react";
import Navegacion from "../components/Navegacion";
import TarjetaReceta from "../components/TarjetaReceta";

function Favoritas() {

    const [favoritas, setFavoritas] = useState([]);

    useEffect(() => {
        cargarFavoritas();
    }, []);

    function cargarFavoritas() {

        const recetas =
            JSON.parse(localStorage.getItem("favoritas")) || [];

        setFavoritas(recetas);

    }

    function eliminarFavorita(id) {

        const nuevasFavoritas = favoritas.filter(
            (receta) => receta.id !== id
        );

        localStorage.setItem(
            "favoritas",
            JSON.stringify(nuevasFavoritas)
        );

        setFavoritas(nuevasFavoritas);

    }

    return (

        <>
            <Navegacion />

            <div className="container mt-4">

                <h1 className="mb-4">
                    Mis recetas favoritas
                </h1>

                {
                    favoritas.length === 0 ? (

                        <p>No hay recetas favoritas.</p>

                    ) : (

                        <div className="row">

                            {
                                favoritas.map((receta) => (

                                    <div
                                        key={receta.id}
                                        className="col-md-4 mb-4"
                                    >

                                        <TarjetaReceta
                                            receta={receta}
                                            eliminarFavorita={eliminarFavorita}
                                        />

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </div>

        </>

    );

}

export default Favoritas;