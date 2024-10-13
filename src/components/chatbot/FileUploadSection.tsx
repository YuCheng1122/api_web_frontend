import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaTrash } from 'react-icons/fa';

interface FileUploadSectionProps {
    contextFiles: File[];
    setContextFiles: React.Dispatch<React.SetStateAction<File[]>>;
    ragFiles: File[];
    setRagFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ contextFiles, setContextFiles, ragFiles, setRagFiles }) => {
    const onDropContext = React.useCallback((acceptedFiles: File[]) => {
        setContextFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, [setContextFiles]);

    const onDropRag = React.useCallback((acceptedFiles: File[]) => {
        setRagFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, [setRagFiles]);

    const { getRootProps: getContextRootProps, getInputProps: getContextInputProps, isDragActive: isContextDragActive } = useDropzone({ onDrop: onDropContext });
    const { getRootProps: getRagRootProps, getInputProps: getRagInputProps, isDragActive: isRagDragActive } = useDropzone({ onDrop: onDropRag });

    const handleContextFileDelete = React.useCallback((index: number) => {
        setContextFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }, [setContextFiles]);

    const handleRagFileDelete = React.useCallback((index: number) => {
        setRagFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }, [setRagFiles]);

    return (
        <div className="space-y-4">
            <FileUploadArea
                title="In context"
                files={contextFiles}
                onDelete={handleContextFileDelete}
                getRootProps={getContextRootProps}
                getInputProps={getContextInputProps}
                isDragActive={isContextDragActive}
                dropzoneText="Drop PDFs or documents here to add context, or click to select files"
            />
            <FileUploadArea
                title="RAG"
                files={ragFiles}
                onDelete={handleRagFileDelete}
                getRootProps={getRagRootProps}
                getInputProps={getRagInputProps}
                isDragActive={isRagDragActive}
                dropzoneText="Drop or generate data for Retrieval-Augmented Generation"
            />
        </div>
    );
};

interface FileUploadAreaProps {
    title: string;
    files: File[];
    onDelete: (index: number) => void;
    getRootProps: any;
    getInputProps: any;
    isDragActive: boolean;
    dropzoneText: string;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ title, files, onDelete, getRootProps, getInputProps, isDragActive, dropzoneText }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold mb-2 flex items-center">
            <FaFileUpload className="mr-2 text-blue-500" />
            {title}
        </h3>
        <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer rounded-lg transition duration-300 ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500 hover:bg-gray-50'
            }`}
        >
            <input {...getInputProps()} />
            <p className="text-sm">{dropzoneText}</p>
        </div>
        <div className="mt-2 space-y-2">
            {files.map((file, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                    <span className="truncate text-sm">{file.name}</span>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default FileUploadSection;