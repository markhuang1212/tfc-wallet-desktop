import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@material-ui/core";
import { useState } from "react";

function SwapView(props: { visible: boolean, onCancel: () => any, onSwap: (destination: string, amount: string) => any }) {
    const [destination, setDestination] = useState('')
    const [amount, setAmount] = useState('')

    return (
        <Dialog open={props.visible} maxWidth="sm" fullWidth>
            <DialogTitle>Swap TFC to TFC-ERC20</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField value={destination} onChange={(e) => setDestination(e.target.value)} label="Private Key of the Exchange Destination Account"/>
                <TextField value={amount} onChange={(e) => setAmount(e.target.value)} label="Amount"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={() => props.onSwap(destination, amount)}>Swap</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SwapView