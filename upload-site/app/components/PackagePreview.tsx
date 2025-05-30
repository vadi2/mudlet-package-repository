import { PackageMetadata } from '@/app/lib/types'
import { ValidationResult } from '@/app/lib/types'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'


interface PackagePreviewProps {
  metadata: PackageMetadata
  filename: string
  onConfirm: () => void
  onCancel: () => void
  isUploading: boolean
  validation: ValidationResult
}

export function PackagePreview({ 
  metadata, 
  filename, 
  onConfirm, 
  onCancel, 
  isUploading,
  validation 
}: PackagePreviewProps) {
  const getFieldStatus = (fieldName: string) => {
    if (validation.missingFields.includes(fieldName)) {
      return <span className="text-red-500 ml-1">✗</span>
    }
    if (validation.fieldErrors[fieldName]) {
      return <span className="text-red-500 ml-1">✗</span>
    }
    return <span className="text-green-500 ml-1">✓</span>
  }

  const getMissingFieldsMessage = () => {
    if (validation.missingFields.length === 0) return ''
    return `Missing required fields: ${validation.missingFields.join(', ')}`
  }  

  const getValidationErrorsMessage = () => {
    return Object.entries(validation.fieldErrors)
      .map(([field, errors]) => errors.join(', '))
      .join(', ')
  }

  return (
    <div className="border rounded-lg p-6 bg-background">
      <h2 className="text-2xl font-bold mb-4">Package preview</h2>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">File:</label>
          </div>
          <p className="break-all">{filename}</p>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">Name:</label>
            {getFieldStatus("mpackage")}
          </div>
          <div className="flex items-center">
            <p className="break-all">{metadata.mpackage}</p>
            {validation.missingFields.includes("mpackage") && (
              <span className="text-red-500">(required)</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">Title:</label>
            {getFieldStatus("title")}
          </div>
          <div className="flex items-center">
            <p className="break-all">{metadata.title}</p>
            {validation.missingFields.includes("title") && (
              <span className="text-red-500">(required)</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">Version:</label>
            {getFieldStatus("version")}
          </div>
          <div className="flex items-center">
            <p>{metadata.version}</p>
            {validation.missingFields.includes("version") && (
              <span className="text-red-500">(required)</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">Author:</label>
            {getFieldStatus("author")}
          </div>
          <div className="flex items-center">
            <p>{metadata.author}</p>
            {validation.missingFields.includes("author") && (
              <span className="text-red-500">(required)</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">Created:</label>
            {getFieldStatus("created")}
          </div>
          <div className="flex items-center">
            <p>{metadata.created}</p>
            {validation.missingFields.includes("created") && (
              <span className="text-red-500">(required)</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">Icon:</label>
          </div>
          <div className="flex items-center">
            {metadata.icon ? (
              <Image
                src={metadata.icon}
                alt="Package icon"
                width={48}
                height={48}
                className="rounded"
              />
            ) : (
              <p className="text-gray-500">No icon provided</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2">
          <div className="flex items-center">
            <label className="font-semibold">Description:</label>
            {getFieldStatus("description")}
          </div>
          <div className="flex items-center">
            <div className="mt-4 description-container">
              <ReactMarkdown className="prose prose-blue max-w-none prose-sm">
                {metadata.description}
              </ReactMarkdown>
            </div>
            {validation.missingFields.includes("description") && (
              <span className="text-red-500">(required)</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {!validation.isValid && (
          <div className="text-red-500 text-sm space-y-2">
            {validation.missingFields.length > 0 && (
              <div>{getMissingFieldsMessage()}</div>
            )}
            {Object.keys(validation.fieldErrors).length > 0 && (
              <div>{getValidationErrorsMessage()}</div>
            )}
          </div>
        )}
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            disabled={isUploading || !validation.isValid}
            className={`
              px-4 py-2 rounded text-white
              ${
                isUploading || !validation.isValid
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }
              flex items-center gap-2
            `}
            title={
              !validation.isValid
                ? `${getMissingFieldsMessage()} ${getValidationErrorsMessage()}`
                : "Confirm upload"
            }
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              "Confirm upload"
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={isUploading}
            className={`
              px-4 py-2 rounded text-white
              ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700"
              }
            `}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
