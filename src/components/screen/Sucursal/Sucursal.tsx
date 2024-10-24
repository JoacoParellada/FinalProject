import { Button } from "react-bootstrap"
import styles from "./Sucursal.module.css"


export const Sucursal = () => {
    return (

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
        <div className={styles.navSucursal}>
            <div className={styles.tittleNav}>Administracion</div>
            <div className={styles.buttonsNavSucursal}>
                <Button style={{display:"flex", alignItems:"center", justifyContent:"center", margin:"1.5rem", height:"7vh", width:"15vw", border:"solid 1px"}} variant="dark">Categorias</Button>
                <Button style={{display:"flex", alignItems:"center", justifyContent:"center", margin:"1.5rem", height:"7vh", width:"15vw", border:"solid 1px"}} variant="dark">Productos</Button>
                <Button style={{display:"flex", alignItems:"center", justifyContent:"center", margin:"1.5rem", height:"7vh", width:"15vw", border:"solid 1px"}} variant="dark">Alergenos</Button>
            </div>
        </div>
    </div>
    )
}
