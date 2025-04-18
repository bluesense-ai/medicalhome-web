{
  id: response.id,
  title: formValues.title,
  start: new Date(formValues.start),
  end: new Date(formValues.end),
  allDay: false,
  serviceId: helper.getMsServiceId(formValues.serviceId, services),
  localServiceId: formValues.serviceId,
  customerNotes: formValues.customerNotes,
  customerEmailAddress: formValues.customerEmailAddress,
  customerPhone: formValues.customerPhone,
  staffMemberIds: formValues.staffMemberIds,
  optOutOfCustomerEmail: formValues.optOutOfCustomerEmail || false,
  isCustomerAllowedToManageBooking:
    formValues.isCustomerAllowedToManageBooking || false,
  healthCardNumber: formValues.healthCardNumber || "",
};