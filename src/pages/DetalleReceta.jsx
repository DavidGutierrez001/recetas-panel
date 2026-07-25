
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