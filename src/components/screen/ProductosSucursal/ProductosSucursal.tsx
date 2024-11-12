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
                    <DropdownButton title="Selecciona una categoria" variant="dark" >
                        <Dropdown.Item href="#/action-1"></Dropdown.Item>
                    </DropdownButton>
                </div>
                <Button
                    variant="dark"
                    className={styles.buttonProductos}
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
                <div className={styles.categoriasTabla}>
                    <h4>Nombre</h4>
                    <h4>Precio</h4>
                    <h4>Descripcion</h4>
                    <h4>Categoria</h4>
                    <h4>Habilitado</h4>
                    <h4>Acciones</h4>
                </div>
                <ListGroup>
                    <ListGroup.Item 
                    className={styles.productoElement}>
                    
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </div>
    )
}
