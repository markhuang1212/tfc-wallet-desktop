import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl } from '@material-ui/core'

interface ImportAccountViewProps {
  visible: boolean
  onCancel: () => any
  onCreateAccount: () => any
  onImportAccount: () => any
}

// eslint-disable-next-line require-jsdoc
function ImportAccountView(props: ImportAccountViewProps) {

  const [action, setAction] = useState<'pending' | 'importing' | 'creating'>('pending')

  const showCreateAccount = () => {
    setAction('creating')
  }

  const showImportAccount = () => {
    setAction('importing')
  }

  if (action === 'pending') {
    return (
      <Dialog open={props.visible} maxWidth="sm" fullWidth>
        <DialogTitle>Import Or Create Account</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button variant="contained" onClick={showCreateAccount} color="primary" style={{ width: '196px' }}>Create Account</Button>
          <Button variant="contained" onClick={showImportAccount} style={{ marginTop: '8px', width: '196px' }} color="primary">Import Account</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    )
  }

  if (action === 'creating') {
    return (
      <Dialog open={props.visible} maxWidth="sm" fullWidth>
        <DialogTitle>Creating An Account</DialogTitle>
        <DialogActions>
          <Button onClick={() => { setAction('pending') }} color="primary">Back</Button>
          <Button onClick={props.onCreateAccount} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    )
  }

  if (action === 'importing') {
    return (
      <Dialog open={props.visible} maxWidth="sm" fullWidth>
        <DialogTitle>Import An Account</DialogTitle>
        <DialogActions>
          <Button onClick={() => { setAction('pending') }} color="primary">Back</Button>
          <Button onClick={props.onImportAccount} color="primary">Import</Button>
        </DialogActions>
      </Dialog>
    )
  }

  throw Error()

}

export default ImportAccountView;
