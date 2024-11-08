import { ILocalidad } from "../types/ILocalidad";
import { BackendClient } from "./BackendClient";
import { BASEURL } from "./BaseUrl";

export class LocalidadesService extends BackendClient<ILocalidad> {
    constructor() {
        super(BASEURL  + "/localidades");
    }

    
    async getLocalidadesByProvincia(provinciaId: number): Promise<ILocalidad[]> {
        const response = await fetch(`${this.baseUrl}/findByProvincia/${provinciaId}`);
        const data = await response.json();
        return data as ILocalidad[];
    }
}