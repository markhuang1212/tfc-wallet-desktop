import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { AccountData } from "./../Types";

interface TransferViewProps {
    visible: boolean
    onTransfer: (recipient: string, amount: string) => any
    onCancel: () => any
}

function TransferView(props: TransferViewProps) {
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')

    const onChangeRecipient = (e: any) => {
        setRecipient(e.target.value)
    }

    const onChangeAmount = (e: any) => {
        setAmount(e.target.value)
    }

    return (
        <Dialog open={props.visible} maxWidth="sm" fullWidth>
            <DialogTitle>Transfer</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField label="Recipient Address" value={recipient} onChange={onChangeRecipient}></TextField>
                <TextField label="Amount" value={amount} onChange={onChangeAmount}></TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color="primary">Cancel</Button>
                <Button color="primary" disabled={amount === '' && recipient === ''} onClick={() => {
                    props.onTransfer(recipient, amount)
                    setRecipient('')
                    setAmount('')
                }}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}

export default TransferView