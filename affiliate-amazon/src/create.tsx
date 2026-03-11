import { useState } from 'react';
import { 
    useDataProvider, 
    useNotify, 
    useRefresh, 
    Button, 
    SaveButton, 
    TextInput, 
    NumberInput,
    SimpleForm, 
    Toolbar 
} from 'react-admin';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const ManualCreateButton = () => {
    const [open, setOpen] = useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (values: any) => {
        try {
            // Hits: POST products/api/v1/products/manual_create/
            await dataProvider.post('products/manual_create', { data: values });
            notify('Product created successfully', { type: 'success' });
            refresh(); 
            handleClose();
        } catch (error: any) {
            notify(`Error: ${error.message}`, { type: 'error' });
        }
    };

    return (
        <>
            <Button label="Add Product" onClick={handleOpen}>
                <AddIcon />
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create New Manual Entry</DialogTitle>
                <SimpleForm 
                    onSubmit={handleSubmit} 
                    toolbar={<DialogToolbar onCancel={handleClose} />}
                >
                    <DialogContent>
                        <TextInput source="asin" label="Amazon ASIN" fullWidth required />
                        <TextInput source="title" label="Product Title" fullWidth required />
                        <NumberInput source="current_price" label="Price" fullWidth required />
                        <TextInput source="currency" label="Currency (USD/KES)" defaultValue="USD" fullWidth required />
                        <TextInput source="image_url" label="Image URL" fullWidth required />
                    </DialogContent>
                </SimpleForm>
            </Dialog>
        </>
    );
};

const DialogToolbar = ({ onCancel, ...props }: any) => (
    <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <SaveButton label="Save Product" />
        <Button label="Cancel" onClick={onCancel} />
    </Toolbar>
);