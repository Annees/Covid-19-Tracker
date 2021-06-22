import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import "./InfoBox.css";

function InfoBox({title, cases, active, isRed, total, ...props}) {       //destructuring the props from infobox
    return (
        <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`} onClick={props.onClick}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>   {/* Title */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>         {/* cases  */}
                <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>  {/* total cases */}
            </CardContent>
        </Card>
    )
}

export default InfoBox
