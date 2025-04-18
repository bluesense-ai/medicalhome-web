interface BatchExecutionProps {
  lastExecution: string;
  nextExecution: string;
}
interface serviceStatusProps {
  status:boolean,
  message:string

}

const LastBatchExecutionTable: React.FC<{ batchExecution: BatchExecutionProps,serviceStatus: serviceStatusProps }> = ({ batchExecution,serviceStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-3 px-4 border border-gray-300 min-w-80">Last Batch Execution (Timestamp)</th>
            <th className="py-3 px-4 border border-gray-300 min-w-80">New Batch Execution (Timestamp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center py-3 px-4 border border-gray-300">
              {batchExecution.lastExecution !== "N/A" ? (
                <span className={`px-3 py-1 text-white rounded
                  ${serviceStatus.status ? "bg-green-500 text-white" : "bg-red-500 text-white"}`
                 }>
                  {batchExecution.lastExecution}
                </span>
              ) : (
                "N/A"
              )}
            </td>
            <td className="text-center py-3 px-4 border border-gray-300">
              {batchExecution.nextExecution !== "N/A" ? (
                <span className={`px-3 py-1 text-white rounded
                   ${serviceStatus.status ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                `}>
                  {batchExecution.nextExecution}
                </span>
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LastBatchExecutionTable;
