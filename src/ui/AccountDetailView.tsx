import AccountData from "./AccountData";

interface AccountDetailViewProps {
  account?: AccountData
}

function AccountDetailView(props: AccountDetailViewProps) {
  if (props.account === undefined) {
    return (
      <div style={{
        padding: '12px',
        flex: 3,
        justifyItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Select An Account</div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '12px',
      flex: 3,
    }}>{props.account.accountId}</div>
  );
}

export default AccountDetailView;
