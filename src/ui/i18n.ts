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
                balance: 'Balance'
            },
            importAccount: {
                importButtonText: 'Import'
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
                balance: '余额'
            },
            importAccount: {
                importButtonText: '导入'
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