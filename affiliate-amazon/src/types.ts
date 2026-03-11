export interface Product {
    id: string; // mapped from asin
    asin: string;
    title: string;
    current_price: string;
    currency: string;
    is_active: boolean;
    image_url: string;
    review: {
        score: number;
        verdict: string;
    };
}