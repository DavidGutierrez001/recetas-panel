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