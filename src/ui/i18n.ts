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
            createOrImportAccountTip: 'You can create or import account in this wallet.'
        }
    },
    'zh-CN': {
        translation: {
            productName: 'TurboFil 多币种钱包',
            refreshButtonText: '刷新',
            accountListTitle: '我的账户',
            createOrImportButtonText: '创建/导入',
            selectAccountTip: '从左侧选择查看的账户',
            createOrImportAccountTip: '您可以在钱包中创建或导入账户。'
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