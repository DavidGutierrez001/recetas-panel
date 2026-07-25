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