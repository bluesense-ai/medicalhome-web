export const formatISODate = (isoString: string) => {
    const date = new Date(isoString);

    // Get individual components
    const options: any = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    // Format the date and time
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  };


 export const getFirstAndLastName = (fullName: string) => {
    const nameArr = fullName.split(" ");
    let first_name, last_name;

    if (nameArr.length > 1) {
      first_name = nameArr[0];
      last_name = nameArr.slice(1).join(" ");
    } else {
      first_name = fullName;
      last_name = "N";
    }

    return { first_name, last_name };
  };
