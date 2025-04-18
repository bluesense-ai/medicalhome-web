import { useCallback, useEffect } from "react";

const useHandleBeforeUnload = (formValues:any, previousFormValues:any, saveRecord:any) => {
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (
        JSON.stringify(formValues) !==
        JSON.stringify(previousFormValues.current)
      ) {
        saveRecord();
        e.preventDefault();
        e.returnValue = "";
      }
    },
    [formValues, previousFormValues, saveRecord]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);
};

export default useHandleBeforeUnload;
