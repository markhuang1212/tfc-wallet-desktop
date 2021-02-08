import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core'

interface ImportAccountViewProps {
  visible: boolean
  onFinish: (action: any) => any
}

// eslint-disable-next-line require-jsdoc
function ImportAccountView(props: ImportAccountViewProps) {
  return (
    <Dialog open={props.visible}>
      <DialogTitle>Import Or Create Account</DialogTitle>
      <DialogContent>
        TBA
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onFinish}>OK</Button>
        <Button onClick={props.onFinish}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImportAccountView;
