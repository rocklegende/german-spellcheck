export const SaveText = ({text}) => {
    const data = new Blob([text], { type: 'text/plain' })
    const downloadLink = window.URL.createObjectURL(data)
    return (
        <>
            <a download='input.txt' href={downloadLink}>Eingabetext runterladen</a>
        </>
    );
}