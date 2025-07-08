function handleFormSubmission(e) {
  var formData = e.namedValues;
  if (validateFormInput(formData)) {
    processFormData(formData);
  }
}

function validateFormInput(formData) {
  for (var key in formData) {
    if (!formData[key] || formData[key].trim() === "") {
      Logger.log("Validation failed: " + key + " is empty.");
      return false;
    }
  }
  return true;
}

function processFormData(formData) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FormResponses");
  var data = Object.values(formData);
  sheet.appendRow(data);
  Logger.log("Form data processed and added to sheet.");
}