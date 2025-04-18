export function getDefaultRangeForBookings() {
  const now = new Date();
  const startDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth()-1,
    1,
  ));


  const endDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth() + 1, 
    0
  ));
  endDate.setUTCHours(23, 59, 59, 999);

  const formatDateToISOString = (date:any) => 
    date.toISOString().split('.')[0] + 'Z';

  return {
    start: formatDateToISOString(startDate),
    end: formatDateToISOString(endDate),
  };
}


export function getCurrentMonthRange(date:any) {
  const now = new Date(date);

 
  const startDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(), // Current month
    1 // First day of the month
  ));


  const endDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ));
  endDate.setUTCHours(23, 59, 59, 999);
  // Reuse the same formatting function
  const formatDateToISOString = (date: any) =>
    date.toISOString().split('.')[0] + 'Z';

  return {
    start: formatDateToISOString(startDate),
    end: formatDateToISOString(endDate),
  };
}
export const getDropdownCoordinates = (  clientX: number,
  clientY: number,
) => {
  const modalWidth = 300; // Adjust as needed
  const modalHeight = 200; // Adjust as needed
  const buffer = 20; // Space from the edge

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let xPosition = clientX;
  let yPosition = clientY;

  if (viewportWidth < 480) {
    // Center the modal
    xPosition = (viewportWidth - 18) / 2;
    yPosition = (viewportHeight - modalHeight) / 2;
  } else {
    // Adjust yPosition if too close to the bottom
    if (yPosition + modalHeight > viewportHeight - buffer) {
      yPosition = viewportHeight - modalHeight - buffer;
    }

    // Adjust xPosition if too close to the right
    if (xPosition + modalWidth > viewportWidth - buffer) {
      xPosition = viewportWidth - modalWidth - buffer;
    }

    // Adjust xPosition if too close to the left
    if (xPosition < 275) {
      xPosition = buffer + 275;
    }

    // Ensure xPosition is not below zero
    if (xPosition < 0) {
      xPosition = 0;
    }
  }

  return { xPosition, yPosition };
};