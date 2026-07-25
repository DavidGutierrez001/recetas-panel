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