var SHEET_NAME = 'Partners';
var ss = SpreadsheetApp.getActiveSpreadsheet();

var PartnerManagement = (function() {
  function init() {
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['ID', 'Name', 'Email', 'Status']);
    }
  }

  function syncPartnerData() {
    var sheet = ss.getSheetByName(SHEET_NAME);
    // Implementation for syncing data from an external source if needed
    Logger.log('Sync function is a placeholder and needs implementation');
  }

  function getPartnerInfo(id) {
    var sheet = ss.getSheetByName(SHEET_NAME);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) { // Start from 1 to skip header
      if (data[i][0] == id) {
        return {
          id: data[i][0],
          name: data[i][1],
          email: data[i][2],
          status: data[i][3]
        };
      }
    }
    return null;
  }

  function updatePartnerInfo(id, data) {
    var sheet = ss.getSheetByName(SHEET_NAME);
    var range = sheet.getDataRange();
    var values = range.getValues();
    for (var i = 1; i < values.length; i++) { // Start from 1 to skip header
      if (values[i][0] == id) {
        var row = i + 1;
        sheet.getRange(row, 2, 1, 3).setValues([[
          data.name || values[i][1],
          data.email || values[i][2],
          data.status || values[i][3]
        ]]);
        return true;
      }
    }
    return false;
  }

  function deletePartner(id) {
    var sheet = ss.getSheetByName(SHEET_NAME);
    var range = sheet.getDataRange();
    var values = range.getValues();
    for (var i = 1; i < values.length; i++) { // Start from 1 to skip header
      if (values[i][0] == id) {
        sheet.deleteRow(i + 1);
        return true;
      }
    }
    return false;
  }

  return {
    init: init,
    syncPartnerData: syncPartnerData,
    getPartnerInfo: getPartnerInfo,
    updatePartnerInfo: updatePartnerInfo,
    deletePartner: deletePartner
  };
})();