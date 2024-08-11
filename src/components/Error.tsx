interface ErrorType {
  errorMessage: string
  setError: (error: string | null) => void
}

const ErrorDisplayer = ({ errorMessage, setError }: ErrorType) => {
  return (
    <div 
      className="absolute top-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 cursor-pointer" 
      role="alert"
      onClick={() => setError(null)}
    >
      <b className="font-bold">Error: </b>
      <span className="block sm:inline">{errorMessage}</span>
    </div>
  )
}

export default ErrorDisplayer
