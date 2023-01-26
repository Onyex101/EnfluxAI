import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useStateContext } from '../../contexts/ContextProvider';

const url = process.env.REACT_APP_API_URL

const FileForm = () => {
    const [files, setFiles] = useState([]);
    const { currentColor } = useStateContext()
    const [loading, setLoading] = useState(false);
    const onDropAccepted = useCallback(acceptedFiles => {
        setFiles(acceptedFiles)
    }, [])
    const maxSize = 52428800;
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        onDropAccepted,
        accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
        minSize: 0,
        maxSize,
        multiple: false,
        maxFiles: 1
    });
    const uploadFile = () => {
        setLoading((prev) => !prev)
        const formData = new FormData();
        formData.append("file", files[0]);
        // let filename;
        fetch(`${url}/predict/file`, {
            method: 'POST',
            body: formData,
        }).then((response) => {
            // filename = response.headers.get("Content-filename")
            // console.log(`filename: ${filename}`)
            // console.log(`headers: ${JSON.stringify(response.headers)}`)
            // test
            return response.blob()
        })
            .then((blob) => {
                // 2. Create blob link to download
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                // link.setAttribute('download', `${filename}`);
                link.setAttribute('download', "processed_batch.xlsx");
                // 3. Append to html page
                document.body.appendChild(link);
                // 4. Force download
                link.click();
                // 5. Clean up and remove the link
                link.parentNode.removeChild(link);
                setLoading((prev) => !prev)
                setFiles([])
            })
            .catch((e) => {
                // console.log(e)
            })
    }
    // const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
    return (
        <div className="w-full flex flex-col">
            <div {...getRootProps({ className: "flex flex-col justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" })}>
                <input {...getInputProps()} />
                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Drag'n'drop files</span> or click to select files</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">XLSX (MAX. 50MB)</p>
                    {files.length > 0 && files.map(f => (
                        <p className="text-green-800 text-sm mt-1" key={f.name}>
                            {f.name}
                        </p>
                    ))}
                </div>
            </div>
            <div className="w-full">
                <button onClick={uploadFile} type="submit" className="font-medium rounded-lg text-sm px-5 py-2.5 hover:drop-shadow-xl disabled:opacity-50 mt-4 float-right" style={{ backgroundColor: currentColor, color: 'white' }} disabled={acceptedFiles.length === 0}>
                    {loading &&
                        <svg className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-100 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    }
                    {!loading && 'Upload'}
                </button>
            </div>
        </div>
    )
}

export default FileForm