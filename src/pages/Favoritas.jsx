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