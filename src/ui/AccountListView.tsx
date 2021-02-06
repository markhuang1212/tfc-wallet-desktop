import AccountListItem from "./AccountListItem";

interface AccountListViewProps {
  onImportAccount: () => any
}

function AccountListView(props: AccountListViewProps) {
  return (
    <div style={{
      backgroundColor: 'lightgray',
      flex: 1,
      minWidth: '256px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        display: 'flex',
        borderBottom: 'solid 1px gray',
        padding: '8px',
      }}>
        <span>My Accounts</span>
        <span style={{ flex: 1 }}></span>
        <button onClick={props.onImportAccount}>Import/Create</button>
      </header>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <AccountListItem accountName="Account 1" accountType="bip44" isSelected={false} />
        <AccountListItem accountName="Account 2" accountType="tfc" isSelected={false} />
      </div>

      <div style={{ padding: '8px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <button>Export</button>
      </div>
    </div>
  )
}

export default AccountListView;
