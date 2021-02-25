import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@material-ui/core";
import { useState } from "react";
import { useTranslation } from 'react-i18next'
import DescriptionText from "./DescriptionText";

function SwapView(props: { visible: boolean, onCancel: () => any, onSwap: (destination: string, amount: string) => any }) {
    const [destination, setDestination] = useState('')
    const [amount, setAmount] = useState('')
    const { t } = useTranslation()

    return (
        <Dialog open={props.visible} maxWidth="sm" fullWidth>
            <DialogTitle>{t('swapTfc.swapTfcTitle')}</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                <DescriptionText>{t('swapTfc.swapTfcDescription', { txFee: '0.001' })}</DescriptionText>
                <TextField value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    label={t('swapTfc.destinationAccountInputLabel')} />
                <TextField value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    label={t('swapTfc.amountInputLabel')} />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={() => {
                    props.onSwap(destination, amount)
                    setDestination('')
                    setAmount('')
                }} disabled={destination === '' || amount === ''}>Swap</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SwapView