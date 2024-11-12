import { ICategorias } from "../types/dtos/categorias/ICategorias";
import { BackendClient } from "./BackendClient";
import { BASEURL } from "./BaseUrl";

export class CategoriaService extends BackendClient<ICategorias> {

    constructor(){
        super(BASEURL + "/categorias")
    }

    async getAllCategoriasBySucursal(idSucursal: number): Promise<ICategorias[]> {
        const response = await fetch(`${this.baseUrl}/allCategoriasPorSucursal/${idSucursal}`);
        const data = await response.json();
        return data as ICategorias[];
    }


}