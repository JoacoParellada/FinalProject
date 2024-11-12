import { FC } from "react";
import { Button, ListGroup } from "react-bootstrap";
import styles from "./CategoriaSucursal.module.css"


interface TablaCategoriasProps {
    // sucursal : ISucursal
    onSelect: () => void;
}

export const CategoriasSucursal: FC<TablaCategoriasProps> = () => {


    return (
    <div className={styles.homeCategorias}>
        <div>
            <Button
                    variant="dark"
                    className={styles.buttonCategorias}
                    style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1E1E1E",
                    }}
                >
                    <span className="material-symbols-outlined">add</span>
                    Agregar un producto
            </Button>
        </div>
        <div>
            <ListGroup>
                <ListGroup.Item className={styles.categoriaElement}></ListGroup.Item>
            </ListGroup>
        </div>
    </div>
    )
}
