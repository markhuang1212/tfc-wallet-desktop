import React from 'react';

interface AccountListViewProps {
  onImportAccount: () => any
}

// eslint-disable-next-line require-jsdoc
function AccountListView(props: AccountListViewProps) {
  return (
    <div style={{
      backgroundColor: 'lightgray',
      flex: 1,
      minWidth: '256px',
    }}>
      <header style={{
        display: 'flex',
        borderBottom: 'solid 1px gray',
        padding: '8px',
      }}>
        <span>My Accounts</span>
        <span style={{flex: 1}}></span>
        <button onClick={props.onImportAccount}>Import/Create</button>
      </header>

      <div>

      </div>
    </div>
  );
}

export default AccountListView;
