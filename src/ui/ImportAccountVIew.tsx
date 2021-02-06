interface ImportAccountViewProps {
    visible: boolean
}

function ImportAccountView(props: ImportAccountViewProps) {
    return (
        <div style={{
            visibility: props.visible ? 'visible' : 'hidden',
            transition: 'ease-in-out',
            width: '500px',
            height: '400px',
            zIndex: 4,
            position: 'fixed',
            backgroundColor: 'white',
            boxShadow: '5px 5px 10px gray',
            top: 'calc((100% - 400px) / 2)',
            left: 'calc((100% - 500px) / 2)',
            borderRadius: '12px',
            padding: '8px'
        }}>
            <h2>Import Account</h2>
        </div>
    )
}

export default ImportAccountView