import { useState } from 'react'
import ReactDom from 'react-dom'
import AccountDetailView from './AccountDetailView'
import AccountListView from './AccountListView'
import ImportAccountView from './ImportAccountVIew'

function App() {

    const [isImportingAccount, setIsImportingAccount] = useState(false)

    return (<div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0pt'
    }}>
        <AccountListView onImportAccount={() => { setIsImportingAccount(!isImportingAccount) }} />
        <AccountDetailView />
        <ImportAccountView visible={isImportingAccount} />
    </div>)
}

ReactDom.render(<App />, document.getElementById('app'))