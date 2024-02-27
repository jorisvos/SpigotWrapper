import React, { FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Select,
  InputLabel,
  OutlinedInput,
  Divider,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

interface Props {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (json: { [k: string]: any }, callback: () => void) => void;
  title: string;
  text: string;
  cancelText?: string;
  submitText?: string;
  dialogComponents: DialogComponents[];
}

interface SelectItems {
  value: string;
  label: string;
}

interface DialogComponents {
  type: 'select' | 'text' | 'file' | 'boolean';
  name: string;
  label: string;
  required: boolean;
  value?: string;
  onValueChanged?: (event: SelectChangeEvent<string>) => void;
  items?: SelectItems[];
}

export const FormDialog: React.FC<Props> = ({
  open,
  handleClose,
  handleSubmit,
  title,
  text,
  cancelText = 'Cancel',
  submitText = 'Submit',
  dialogComponents,
}) => {
  const [disableButtons, setDisableButtons] = useState(false);

  const handleDialogClose = () => {
    setDisableButtons(false);
    handleClose();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisableButtons(true);

    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line
    const formJson = Object.fromEntries((formData as any).entries());

    handleSubmit(formJson, handleDialogClose);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: onSubmit,
        }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>

          <Divider sx={{ mt: 1, mb: 1 }} />

          {dialogComponents.map((component, index) => (
            <span key={index}>
              {component.type === 'select' ? (
                <>
                  <InputLabel htmlFor={component.name + '-input'}>
                    {component.label}
                  </InputLabel>
                  <Select
                    sx={{ mb: 1 }}
                    native
                    required={component.required}
                    id={component.name}
                    name={component.name}
                    value={component.value}
                    onChange={component.onValueChanged}
                    input={
                      <OutlinedInput
                        label={component.label}
                        id={component.name + '-input'}
                      />
                    }>
                    {component.items
                      ? component.items.map((item, i) => (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        ))
                      : 'THERE ARE NO GIVIN ITEMS TO SELECT FROM'}
                  </Select>
                </>
              ) : component.type === 'text' ? (
                <TextField
                  sx={{ mb: 1 }}
                  required={component.required}
                  margin="dense"
                  id={component.name}
                  name={component.name}
                  label={component.label}
                  type="text"
                  fullWidth
                  variant="standard"
                />
              ) : component.type === 'file' ? (
                <TextField
                  sx={{ mb: 1 }}
                  required={component.required}
                  margin="dense"
                  id={component.name}
                  name={component.name}
                  label={component.label}
                  type="file"
                  fullWidth
                  variant="standard"
                />
              ) : component.type === 'boolean' ? (
                <FormControlLabel
                  sx={{ mb: 1 }}
                  value={true}
                  control={
                    <Checkbox
                      required={component.required}
                      id={component.name}
                      name={component.name}
                    />
                  }
                  label={component.label}
                  labelPlacement="start"
                />
              ) : (
                `WRONG COMPONENT TYPE: ${component.type}`
              )}
            </span>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} disabled={disableButtons}>
            {cancelText}
          </Button>
          <Button type="submit" disabled={disableButtons}>
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormDialog;
