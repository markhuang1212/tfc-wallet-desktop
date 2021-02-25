import i18n, { Module, Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources: Resource = {
    en: {
        translation: {
            productName: 'TurboFil Multi-Coin Wallet',
            refreshButtonText: 'Refresh',
            accountListTitle: 'My Accounts',
            createOrImportButtonText: 'Create/Import',
            selectAccountTip: 'Select An Account to View',
            createOrImportAccountTip: 'You can create or import account in this wallet.',
            swapButtonText: 'Swap',
            transferButtonText: 'Transfer',
            cancelButtonText: 'Cancel',
            accountDetail: {
                editAccountNameText: 'Account Name',
                chooseAccountIndexText: 'Account Index',
                chooseErcCoinDescription: 'You can view and transfer Ether and supported ERC20 Coins.',
                chooseAccountIndexDescription: 'You can manipulate multiple addresses in a single BIP44 account. You can use different account for different purposes.',
                balance: 'Balance',
                chooseEndpointText: 'Endpoint',
                chooseEndpointDescription: 'You can choose different TFC-chain endpoints.'
            },
            importAccount: {
                importAccountTitle: 'Import Or Create Account',
                importButtonText: 'Import',
                accountTypeFieldText: 'Account Type',
                accountTypeDescriptionText: 'BIP44 Account enables you to have multiple crypto-currency coins and addresses in one single account.',
                bip44Account: 'BIP44 Account',
                standaloneAccount: 'Standalone Account',
                formatFieldText: 'Import Format',
                formatSeed: 'Seed',
                formatMnemonic: 'Mnemonic',
                formatPrivKey: 'Private Key',
                coinTypeFieldText: 'Coin Type',
                createAccountTip: 'If you want to generate a new account, leave this field empty.'
            }
        }
    },
    'zh-CN': {
        translation: {
            productName: 'TurboFil 多币种钱包',
            refreshButtonText: '刷新',
            accountListTitle: '我的账户',
            createOrImportButtonText: '创建/导入',
            selectAccountTip: '从左侧选择查看的账户',
            createOrImportAccountTip: '您可以在钱包中创建或导入账户。',
            swapButtonText: '转换',
            transferButtonText: '转账',
            cancelButtonText: '取消',
            accountDetail: {
                editAccountNameText: '账户名称',
                chooseAccountIndexText: '选择账户',
                chooseErcCoinDescription: '您可以对以太坊和支持的ERC20货币进行查看和转账。',
                chooseAccountIndexDescription: '在BIP44账户中，您可以对拥有的多个账户进行查询和转账。您可以将他们用作不同用途。',
                balance: '余额',
                chooseEndpointText: '节点',
                chooseEndpointDescription: '您可以选择不同的TFC链节点。'
            },
            importAccount: {
                importAccountTitle: '导入或创建账户',
                importButtonText: '导入',
                accountTypeFieldText: '账户种类',
                accountTypeDescriptionText: 'BIP44账户能够让您方便地同时管理多个加密货币的地址。',
                bip44Account: 'BIP44账户',
                standaloneAccount: '独立账户',
                formatFieldText: '导入格式',
                formatSeed: 'Seed',
                formatMnemonic: '助记词',
                formatPrivKey: '私钥',
                coinTypeFieldText: '货币种类',
                createAccountTip: '如果您想创建一个新账户，请在此处留空。'
            }
        }
    }
}

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'zh-CN'
    })

export default i18n