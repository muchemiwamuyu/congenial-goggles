import jsonServerProvider from "ra-data-json-server";
import { fetchUtils, DataProvider } from "react-admin";

const apiUrl = "https://et.urbantrends.dev/products/api/v1";

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    const authString = localStorage.getItem('auth');
    if (authString) {
        try {
            const auth = JSON.parse(authString);
            if (auth.access) {
                options.headers.set('Authorization', `Bearer ${auth.access}`);
            }
        } catch (e) {
            console.error("Failed to parse auth", e);
        }
    }
    return fetchUtils.fetchJson(url, options);
};

const baseProvider = jsonServerProvider(apiUrl, httpClient);

export const dataProvider: DataProvider & { addReview: Function } = {
    ...baseProvider,

    addReview: async (resource: string, params: { id: string; data: any }) => {
        const encodedSlug = encodeURIComponent(params.id);
        const url = `${apiUrl}/${resource}/${encodedSlug}/add_review/`;
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });
        return { data: json };
    },

    update: async (resource: string, params: any) => {
        const encodedSlug = encodeURIComponent(params.id);
        const url = `${apiUrl}/${resource}/${encodedSlug}/`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.slug } };
    },

    create: async (resource: string, params: any) => {
        const url = `${apiUrl}/${resource}/`;
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.slug } };
    },

    /**
     * DELETE /products/:slug/
     * Overriding baseProvider to handle the specific slug URL and trailing slash.
     */
    delete: async (resource: string, params: any) => {
        const encodedSlug = encodeURIComponent(params.id);
        const url = `${apiUrl}/${resource}/${encodedSlug}/`;
        
        console.log(`Explicitly initializing DELETE for: ${url}`);

        const { json } = await httpClient(url, {
            method: 'DELETE',
        });
        
        return { data: json };
    },

    /**
     * DELETEMANY /products/:slug/
     * Django doesn't usually support bulk delete via a single URL out of the box,
     * so we map through the IDs and send individual DELETE requests.
     */
    deleteMany: async (resource: string, params: any) => {
        const responses = await Promise.all(
            params.ids.map((id: string) =>
                httpClient(`${apiUrl}/${resource}/${encodeURIComponent(id)}/`, {
                    method: 'DELETE',
                })
            )
        );
        return { data: responses.map(({ json }) => json?.id || params.ids) };
    },

    getList: async (resource: string) => {
        const url = `${apiUrl}/${resource}/`;
        const { json } = await httpClient(url);
        const records = Array.isArray(json) ? json : json.results;
        
        return {
            data: records.map((record: any) => ({ 
                ...record, 
                id: record.slug 
            })),
            total: Array.isArray(json) ? json.length : json.count,
        };
    },

    getOne: async (resource: string, params: any) => {
        const encodedSlug = encodeURIComponent(params.id);
        const url = `${apiUrl}/${resource}/${encodedSlug}/`;
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.slug } };
    },
};