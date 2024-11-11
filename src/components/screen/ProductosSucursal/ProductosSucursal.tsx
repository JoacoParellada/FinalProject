import { FC } from "react";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { Button, Dropdown, DropdownButton, ListGroup } from "react-bootstrap";

import styles from  "./ProductosSucursal.module.css"

interface TablaProductosProps {
    // sucursal : ISucursal
    onSelect: () => void;
}

export const ProductosSucursal :FC<TablaProductosProps> = () => {

    
    return (
        <div className={styles.homeProductos}>
            <div className={styles.headerProductos}>
                <div className={styles.filtrarProducto}>
                    <h3>Filtrar por categoria:</h3>
                    <DropdownButton id="dropdown-basic-button" title="Selecciona una categoria">
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    </DropdownButton>
                </div>
                <Button
                    variant="dark"
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
            <div  className={styles.listProductos}>
                <ListGroup>
                    <ListGroup.Item>Hola</ListGroup.Item>
                </ListGroup>
            </div>
        </div>
    )
}
