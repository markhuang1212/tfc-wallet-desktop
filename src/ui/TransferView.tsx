import { Dialog } from "@material-ui/core";
import { AccountData } from "./../Types";

interface TransferViewProps {
    visible: boolean
    account: AccountData
    onFinish: () => any
    onCancel: () => any
}

function TransferView(props: TransferViewProps) {
    return (
        <Dialog open={props.visible}>
            
        </Dialog>
    )
}