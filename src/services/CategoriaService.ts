import { ICategorias } from "../types/dtos/categorias/ICategorias";
import { BackendClient } from "./BackendClient";
import { BASEURL } from "./BaseUrl";

export class CategoriaService extends BackendClient<ICategorias> {
  constructor() {
    super(BASEURL + "/categorias");
  }

  async getAllCategoriasBySucursal(idSucursal: number): Promise<ICategorias[]> {
    const response = await fetch(
      `${this.baseUrl}/allCategoriasPorSucursal/${idSucursal}`
    );
    const data = await response.json();
    return data as ICategorias[];
  }

  async getAllsubcategoriasByCategoriaPadre(
    idSucursal: number,
    idPadre: number
  ): Promise<ICategorias[]> {
    const response = await fetch(
      `${this.baseUrl}/allSubCategoriasPorCategoriaPadre/${idPadre}/${idSucursal}`
    );
    const data = await response.json();
    return data as ICategorias[];
  }
  async post(newCategoria: ICategorias): Promise<ICategorias> {
    const response = await fetch(`${this.baseUrl}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategoria),
    });

    if (!response.ok) {
      throw new Error("Error al agregar la categoría");
    }

    const data = await response.json();
    return data as ICategorias;
  }
  async put(id: number, data: ICategorias): Promise<ICategorias> {
    const response = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error updating categoria");
    }

    const updatedData = await response.json();
    return updatedData as ICategorias; // Asegúrate de que esto devuelva la categoría actualizada
  }
}
