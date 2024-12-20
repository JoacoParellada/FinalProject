import { AbstractBackendClient } from "./AbstractBackendClient";

export abstract class BackendClient<T> extends AbstractBackendClient<T> {
	constructor(baseUrl: string) {
		super(baseUrl);
	}

	async getAll(): Promise<T[]> {
		const response = await fetch(`${this.baseUrl}/`);
		if (!response.ok) {
			throw new Error(`Error`);
		}
		const data = await response.json();
		return data as T[];
	}

	async getById(id: number): Promise<T | null> {
		const response = await fetch(`${this.baseUrl}/${id}`);
		if (!response.ok) {
			const errorData = await response.json();
			console.error(`Error fetching by ID ${id}:`, errorData);
			return null;
		}
		const data = await response.json();
		return data as T;
	}

	async post(data: T): Promise<T> {
		const response = await fetch(`${this.baseUrl}/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const newData = await response.json();
		return newData as T;
	}

	async put(id: number, data: T): Promise<T> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const newData = await response.json();
		return newData as T;
	}


	async delete(id: number): Promise<void> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			throw new Error(`Error al eliminar el elemento con ID ${id}`);
		}
	}
}
