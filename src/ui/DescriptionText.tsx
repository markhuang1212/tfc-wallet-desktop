import { Typography } from "@material-ui/core";
import { ReactNode } from "react";
import { JsxElement } from "typescript";

function DescriptionText(props: { children: ReactNode }) {
    return (
        <Typography variant="body2" color="textSecondary">
            {props.children}
        </Typography>
    )
}

export default DescriptionText