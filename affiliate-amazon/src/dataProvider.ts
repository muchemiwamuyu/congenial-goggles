import jsonServerProvider from "ra-data-json-server";
import { DataProvider } from "react-admin";

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;
const baseProvider = jsonServerProvider(apiUrl);

export const dataProvider: DataProvider = {
    ...baseProvider,
    getList: async (resource, params) => {
        // 1. Construct the URL manually to avoid the "products/products" issue 
        // and fetch the raw data
        const response = await fetch(`${apiUrl}/${resource}`);
        const data = await response.json();

        // 2. React-Admin REQUIRES an 'id' field. Map 'asin' to 'id'.
        const normalizedData = data.map((record: any) => ({
            ...record,
            id: record.asin, 
        }));

        // 3. Return the format React-Admin expects
        return {
            data: normalizedData,
            total: data.length, // This replaces the missing X-Total-Count header
        };
    },
    // Ensure getOne also maps the ID so the Edit/Show views work
    getOne: async (resource, params) => {
        const response = await fetch(`${apiUrl}/${resource}/${params.id}`);
        const data = await response.json();
        return {
            data: { ...data, id: data.asin },
        };
    },
};