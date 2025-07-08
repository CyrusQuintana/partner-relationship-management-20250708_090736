const PartnerManagement = (function() {

  function init() {
    if (!SpreadsheetApp) {
      throw new Error('SpreadsheetApp is not available. Make sure this script is running in a Google Apps environment.');
    }

    const sheetName = 'PartnerData';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(['ID', 'Name', 'Email', 'Phone', 'Address']); // Initialize with columns
    }
  }

  function syncPartnerData(partnerData) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PartnerData');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const startRow = sheet.getLastRow() + 1;
    const data = partnerData.map(partner => {
      return headers.map(header => partner[header]);
    });
    
    if (data.length > 0) {
      sheet.getRange(startRow, 1, data.length, data[0].length).setValues(data);
    }
  }

  function getPartnerInfo(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PartnerData');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) { // Assuming ID can be numeric or string
        const headers = data[0];
        let partnerInfo = {};
        headers.forEach((header, index) => {
          partnerInfo[header] = data[i][index];
        });
        return partnerInfo;
      }
    }
    return null;
  }

  function updatePartnerInfo(id, data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PartnerData');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const dataRange = sheet.getDataRange().getValues();

    for (let i = 1; i < dataRange.length; i++) {
      if (dataRange[i][0] === id) { // Using strict comparison for type safety
        headers.forEach((header, index) => {
          if (data[header] !== undefined) {
            sheet.getRange(i + 1, index + 1).setValue(data[header]);
          }
        });
        return;
      }
    }
  }

  function deletePartner(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PartnerData');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) { // Using strict comparison for type safety
        sheet.deleteRow(i + 1);
        return;
      }
    }
  }

  // Expose the functions
  return {
    init: init,
    syncPartnerData: syncPartnerData,
    getPartnerInfo: getPartnerInfo,
    updatePartnerInfo: updatePartnerInfo,
    deletePartner: deletePartner,
  };

})();