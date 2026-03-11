import React, { useState } from 'react';
import {
    List, Datagrid, TextField, NumberField, BooleanField, ImageField,
    TopToolbar, useDataProvider, useNotify, useRefresh, Button,
    SimpleForm, NumberInput, TextInput, BooleanInput, SaveButton, Toolbar,
    FunctionField, useRecordContext
} from "react-admin";
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AddIcon from '@mui/icons-material/Add';
import { Product } from "./types";

// --- 1. Create Product Modal ---
const CreateProductDialog = () => {
    const [open, setOpen] = useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSave = async (values: any) => {
        try {
            // Ensure dataProvider.create is used (which adds the trailing slash)
            await dataProvider.create('products', { data: values });
            notify('Product created successfully', { type: 'success' });
            refresh();
            setOpen(false);
        } catch (e: any) {
            notify('Error creating product', { type: 'error' });
        }
    };

    return (
        <>
            <Button label="Add Product" onClick={() => setOpen(true)}>
                <AddIcon />
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Product</DialogTitle>
                <DialogContent>
                    <SimpleForm onSubmit={handleSave} toolbar={<Toolbar><SaveButton label="Create" /></Toolbar>}>
                        <TextInput source="asin" label="ASIN" fullWidth required />
                        <TextInput source="title" fullWidth required />
                        <TextInput source="image_url" label="Image URL" fullWidth />
                        <Box display="flex" gap={2}>
                            <NumberInput source="current_price" label="Price" sx={{ width: '50%' }} />
                            <TextInput source="currency" defaultValue="USD" sx={{ width: '50%' }} />
                        </Box>
                        <BooleanInput source="is_active" defaultValue={true} />
                    </SimpleForm>
                </DialogContent>
            </Dialog>
        </>
    );
};

// --- 2. Add Review Modal ---
const AddReviewDialog = () => {
    const record = useRecordContext<Product>();
    const [open, setOpen] = useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleOpen = (e: React.MouseEvent) => {
        // PREVENT rowClick="edit" from firing
        e.stopPropagation();
        e.preventDefault();
        
        if (!record) {
            notify('Error: Row data missing', { type: 'error' });
            return;
        }
        setOpen(true);
    };

    const handleSave = async (values: any) => {
        // Use 'id' which your dataProvider maps from 'slug'
        const slug = record?.id || record?.slug;

        if (!slug) {
            notify('Error: Missing slug', { type: 'error' });
            return;
        }

        try {
            const payload = {
                ...values,
                pros: typeof values.pros === 'string' ? values.pros.split('\n').filter((p: string) => p.trim()) : [],
                cons: typeof values.cons === 'string' ? values.cons.split('\n').filter((c: string) => c.trim()) : [],
                is_featured: !!values.is_featured
            };

            // This custom call must also ensure it hits the slashed URL
            await dataProvider.addReview('products', { 
                id: slug, 
                data: payload 
            });

            notify('Review added', { type: 'success' });
            refresh();
            setOpen(false);
        } catch (e: any) {
            const msg = e.status === 401 ? 'Session expired' : 'Error saving review';
            notify(msg, { type: 'error' });
        }
    };

    return (
        <>
            <Button 
                label="Review" 
                onClick={handleOpen} 
                sx={{ minWidth: 'auto' }}
                // Secondary safeguard to prevent bubbling
                onMouseDown={(e) => e.stopPropagation()}
            >
                <RateReviewIcon />
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                // Prevent clicks inside the modal from closing it or affecting the row
                onClick={(e) => e.stopPropagation()}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add Review for {record?.asin}</DialogTitle>
                <DialogContent>
                    <SimpleForm
                        onSubmit={handleSave}
                        toolbar={<Toolbar><SaveButton label="Save Review" /></Toolbar>}
                    >
                        <NumberInput source="score" step={0.1} fullWidth defaultValue={8.0} />
                        <TextInput source="verdict" fullWidth multiline rows={2} />
                        <TextInput source="pros" label="Pros (One per line)" fullWidth multiline rows={3} />
                        <TextInput source="cons" label="Cons (One per line)" fullWidth multiline rows={2} />
                        <TextInput source="full_analysis" label="Full Analysis" fullWidth multiline rows={3} />
                        <TextInput source="meta_description" label="Meta Description" fullWidth />
                        <BooleanInput source="is_featured" label="Featured Review" defaultValue={true} />
                    </SimpleForm>
                </DialogContent>
            </Dialog>
        </>
    );
};

// --- 3. List Actions ---
const ListActions = () => (
    <TopToolbar>
        <CreateProductDialog />
    </TopToolbar>
);

// --- 4. Main Product List ---
export const ProductList = () => (
    <List actions={<ListActions />}>
        <Datagrid<Product> rowClick="edit">
            <TextField source="asin" label="ASIN" />
            <ImageField source="image_url" label="Preview" />
            <TextField source="title" />
            <FunctionField
                label="Price"
                render={(record: Product) => (
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                        {record.currency === 'USD' ? '$' : record.currency}{record.current_price}
                    </Box>
                )}
            />
            <NumberField source="review.score" label="Score" />
            <BooleanField source="is_active" />
            <AddReviewDialog /> 
        </Datagrid>
    </List>
);