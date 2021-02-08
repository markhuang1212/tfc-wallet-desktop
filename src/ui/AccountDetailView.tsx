import AccountData from "./AccountData";
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ImportExport } from '@material-ui/icons'

const useStyle = makeStyles({
  container: {
    flex: 2
  },
  content: {
    padding: '8px'
  }
})

interface AccountDetailViewProps {
  account?: AccountData
}

function AccountDetailView(props: AccountDetailViewProps) {
  const classes = useStyle()

  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant='h6'>TFC Wallet</Typography>
          <span style={{ flex: 1 }}></span>
          {props.account && (<Button color="inherit">Transfer</Button>)}
          {props.account && (<Button color="inherit">Export</Button>)}
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <Typography>
          {props.account && JSON.stringify(props.account, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 4)}
          {props.account === undefined && "Select an account"}
        </Typography>
      </div>
    </div>
  );
}

export default AccountDetailView;
