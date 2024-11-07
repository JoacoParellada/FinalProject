import { ICreateEmpresaDto } from "../types/dtos/empresa/ICreateEmpresaDto";
import { IEmpresa } from "../types/dtos/empresa/IEmpresa";
import { IUpdateEmpresaDto } from "../types/dtos/empresa/IUpdateEmpresaDto";
import { BackendClient } from "./BackendClient";

const API_URL = import.meta.env.VITE_URL_API;

export class EmpresaService extends BackendClient<
  IEmpresa | ICreateEmpresaDto | IUpdateEmpresaDto
> {
  constructor(baseUrl: string) {
    super(`${API_URL}/${baseUrl}`);
  }

  async getAllEmpresas(): Promise<IEmpresa[]> {
    const response = await fetch(`http://localhost:8090/empresas`);
    if (!response.ok) {
      throw new Error(`Error`);
    }
    const data = await response.json();
    return data as IEmpresa[];
  }
}
