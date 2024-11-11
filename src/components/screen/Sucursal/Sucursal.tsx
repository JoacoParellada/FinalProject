import { Button } from "react-bootstrap"
import styles from "./Sucursal.module.css"
import { useState } from "react";
import { AlergenosSucursal } from "../AlergenosSucursal/AlergenosSucursal";
import { ProductosSucursal } from "../ProductosSucursal/ProductosSucursal";


export const Sucursal = () => {

    const [showAlergenos, setShowAlergenos] = useState(false)
    const [showProductos, setShowProductos] = useState(false)
    

    const handleShowProductos = () => {
        setShowAlergenos(false)
        setShowProductos(true)
    }

    const handleShowAlergenos = () => {
        setShowProductos(false)
        setShowAlergenos(true)
    }

    


    return (

    

    <div className={styles.mainSucursal}>
        <div className={styles.mainSucursal}>
            <div className={styles.headerSucursal}>
                <Button 
                    style={{width:"60px", display:"flex", justifyContent:"center", alignItems:"center", margin:"0.5rem 1.5rem", border:"solid 1px" }} 
                    variant="dark">
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                </Button>
                <h2 style={{paddingTop:"1.3vh"}}>EMPRESA - SUCURSAL</h2>
            </div>
            <div className={styles.container}>
                <div className={styles.navSucursal}>
                    <div className={styles.tittleNav}>Administracion</div>
                    <div className={styles.buttonsNavSucursal}>
                        <Button style={{display:"flex", alignItems:"center", justifyContent:"center", margin:"1.5rem", height:"7vh", width:"15vw", border:"solid 1px"}} variant="dark">Categorias</Button>
                        <Button onClick={handleShowProductos} style={{display:"flex", alignItems:"center", justifyContent:"center", margin:"1.5rem", height:"7vh", width:"15vw", border:"solid 1px"}} variant="dark">Productos</Button>
                        <Button onClick={handleShowAlergenos} style={{display:"flex", alignItems:"center", justifyContent:"center", margin:"1.5rem", height:"7vh", width:"15vw", border:"solid 1px"}} variant="dark">Alergenos</Button>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.tableAlergenos}>
                        {showProductos && <ProductosSucursal onSelect={() => setShowAlergenos(true)} />}
                        {showAlergenos && <AlergenosSucursal onSelect={() => setShowAlergenos(true)} />} 
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
