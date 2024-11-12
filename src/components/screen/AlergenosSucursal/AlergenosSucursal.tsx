import { FC, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import styles from "./AlergenosSucursal.module.css"


interface TablaAlergenosProps {
    
    onSelect: () => void;
}

export const AlergenosSucursal : FC<TablaAlergenosProps> = () => {

    const  [showModalAddAlergeno, setshowModalAddAlergeno] = useState(false)
    const  [showModalAlergeno, setshowModalAlergeno] = useState(false)
    const  [showModalEditAlergeno, setshowModalEditAlergeno] = useState(false)

    

    
    return (
        <div className={styles.headerContainer}>
            <div className={styles.buttonAgregarAlergeno}>
                <Button
                    variant="dark"
                    style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1E1E1E",
                    }}
                >
                    <span className="material-symbols-outlined">add</span>
                    Agregar Alergeno
                </Button>
            </div>
            <div  className={styles.listAlergenos}>
                <div className={styles.categoriasTabla}>
                    <h4>Nombre</h4>
                    <h4>Acciones</h4>
                </div>
                <ListGroup>
                    <ListGroup.Item className={styles.alergenoElement}></ListGroup.Item>
                </ListGroup>
            </div>
            
        </div>
    ) 
}
