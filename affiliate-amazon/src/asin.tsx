import { useState } from 'react';
import { 
    useDataProvider, 
    useNotify, 
    useRefresh, 
    Button, 
    SaveButton, 
    TextInput, 
    SimpleForm, 
    Toolbar 
} from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const ImportAsinButton = () => {
    const [open, setOpen] = useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (values: { asin: string }) => {
        try {
            // This hits: POST /products/import_asin/
            await dataProvider.post('products/import_asin', { data: values });
            notify('Product imported successfully', { type: 'success' });
            refresh(); // Reload the list to show the new product
            handleClose();
        } catch (error) {
            notify('Error importing product', { type: 'error' });
        }
    };

    return (
        <>
            <Button label="Import ASIN" onClick={handleOpen}>
                <FileDownloadIcon />
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Import Product from Amazon</DialogTitle>
                <SimpleForm 
                    onSubmit={handleSubmit} 
                    toolbar={<DialogToolbar onCancel={handleClose} />}
                >
                    <DialogContent>
                        <TextInput source="asin" label="Enter Amazon ASIN" fullWidth required />
                    </DialogContent>
                </SimpleForm>
            </Dialog>
        </>
    );
};

const DialogToolbar = ({ onCancel, ...props }: any) => (
    <Toolbar {...props} sx={{ justifyContent: 'space-between' }}>
        <SaveButton label="Import" />
        <Button label="ra.action.cancel" onClick={onCancel} />
    </Toolbar>
);