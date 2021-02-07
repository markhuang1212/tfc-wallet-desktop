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
    }}>{JSON.stringify(props.account, (_, value) => (typeof value === 'bigint' ? value.toString(): value), 4)}</div>
  );
}

export default AccountDetailView;
