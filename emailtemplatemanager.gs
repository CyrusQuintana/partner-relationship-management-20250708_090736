var EMAIL_TEMPLATE_SHEET_NAME = 'EmailTemplates';

function createEmailTemplate(type, data) {
  var sheet = getEmailTemplateSheet();
  var newRow = [new Date(), type].concat(data);
  sheet.appendRow(newRow);
  return {
    success: true,
    message: 'Template created successfully',
    templateId: sheet.getLastRow()
  };
}

function getTemplateById(templateId) {
  var sheet = getEmailTemplateSheet();
  var maxRows = sheet.getLastRow();
  if (templateId > 0 && templateId <= maxRows) {
    var rowData = sheet.getRange(templateId, 1, 1, sheet.getLastColumn()).getValues()[0];
    return {
      success: true,
      data: rowData
    };
  } else {
    return {
      success: false,
      message: 'Template not found'
    };
  }
}

function updateTemplate(templateId, newData) {
  var sheet = getEmailTemplateSheet();
  var maxRows = sheet.getLastRow();
  if (templateId > 0 && templateId <= maxRows) {
    sheet.getRange(templateId, 3, 1, newData.length).setValues([newData]);
    return {
      success: true,
      message: 'Template updated successfully'
    };
  } else {
    return {
      success: false,
      message: 'Template not found'
    };
  }
}

function deleteTemplate(templateId) {
  var sheet = getEmailTemplateSheet();
  var maxRows = sheet.getLastRow();
  if (templateId > 0 && templateId <= maxRows) {
    sheet.deleteRow(templateId);
    return {
      success: true,
      message: 'Template deleted successfully'
    };
  } else {
    return {
      success: false,
      message: 'Template not found'
    };
  }
}

function getEmailTemplateSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(EMAIL_TEMPLATE_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(EMAIL_TEMPLATE_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Type', 'Data']);
  }
  return sheet;
}