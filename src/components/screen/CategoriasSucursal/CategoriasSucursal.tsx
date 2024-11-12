import { FC, useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import styles from "./CategoriaSucursal.module.css"
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { CategoriaService } from "../../../services/CategoriaService";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";


interface TablaCategoriasProps {
    sucursal : ISucursal | null
    onSelect: () => void;
}

export const CategoriasSucursal: FC<TablaCategoriasProps> = ({
    sucursal
}) => {

    const categoriaService = new CategoriaService()
    const [categorias, setCategorias] = useState<ICategorias[]>([]);

    const fetchCategoriasBySucursal = async (idSucursal: number) => {
        try {
            const data = await categoriaService.getAllCategoriasBySucursal(idSucursal);
            console.log("Categorias: ", data);
            setCategorias(data);
        } catch (error) {
            console.log("Error fetching categorias:", error);
        }
    };

    useEffect(() => {
        if (sucursal) {
            fetchCategoriasBySucursal(sucursal.id);
        }
    }, [sucursal]);

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
                    Agregar una categoria
            </Button>
        </div>
        <div>
            <ListGroup>
                {categorias.map((categoria, index)=>(
                    <ListGroup.Item 
                    className={styles.categoriaElement}
                    key={index}
                    >
                        {categoria.denominacion}
                        <div className={styles.buttonsCategoria}>
                            <Button
                                className="d-flex align-items-center"
                                style={{ color: "black", backgroundColor: "transparent", border: "solid 1px" }}  
                                >
                                <span 
                                    className="material-symbols-outlined" 
                                    style={{ color: "black" }}>
                                    arrow_drop_down
                                </span>
                            </Button>
                        
                            <Button
                                className="d-flex align-items-center"
                                variant="primary"
                            >
                                <span
                                className="material-symbols-outlined"
                                style={{ color: "black" }}
                                >
                                edit
                                </span>
                            </Button>
                            <Button
                                className="d-flex align-items-center"
                                variant="success"
                                >
                                <span 
                                    className="material-symbols-outlined" 
                                    style={{ color: "black" }}>
                                    add
                                </span>
                            </Button>
                        </div>
                        
                    </ListGroup.Item>
                ))}                
                
            </ListGroup>
        </div>
    </div>
    )
}
