type Props = {
    response: string;
  };
  
  const Display = ({ response }: Props) => {
    return (
      <div className="max-w-3xl mx-auto my-4 p-4 border border-gray-300 rounded-md shadow-md">
        <h1 className="text-xl font-bold mb-2">Response</h1>
        <p>{response}</p>
      </div>
    );
  };
  
  export default Display;