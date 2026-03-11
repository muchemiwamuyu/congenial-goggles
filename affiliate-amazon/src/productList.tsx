import {
    List,
    Datagrid,
    TextField,
    NumberField,
    BooleanField,
    ImageField,
    WrapperField
} from "react-admin";
import { Product } from "./types";

export const ProductList = () => (
    <List>
        <Datagrid<Product> rowClick="edit">
            <TextField source="asin" label="ASIN" />
            <ImageField source="image_url" label="Preview" sx={{ '& img': { maxWidth: 50, maxHeight: 50 } }} />
            <TextField source="title" />
            <WrapperField label="Price">
                <TextField source="current_price" /> <TextField source="currency" />
            </WrapperField>
            <NumberField source="review.score" label="Score" />
            <BooleanField source="is_active" />
        </Datagrid>
    </List>
);