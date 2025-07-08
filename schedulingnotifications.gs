const SchedulingNotificationsNamespace = {};

SchedulingNotificationsNamespace.init = function() {
  ScriptApp.newTrigger('SchedulingNotificationsNamespace.sendScheduledReminders')
    .timeBased()
    .everyHours(1)
    .create();
}

SchedulingNotificationsNamespace.scheduleMeeting = function(partnerId, datetime) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  sheet.appendRow([SchedulingNotificationsNamespace.generateMeetingId(), partnerId, datetime]);
  
  const calendar = CalendarApp.getDefaultCalendar();
  const startDate = new Date(datetime);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  calendar.createEvent('Meeting with Partner ' + partnerId, startDate, endDate);
}

SchedulingNotificationsNamespace.sendReminderEmail = function(meetingId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  const data = sheet.getDataRange().getValues();
  const meeting = data.find(row => row[0] === meetingId);
  if (meeting) {
    const emailAddress = SchedulingNotificationsNamespace.getPartnerEmail(meeting[1]);
    const subject = 'Upcoming Meeting Reminder';
    const body = 'This is a reminder for your upcoming meeting scheduled on ' + meeting[2].toString();
    MailApp.sendEmail(emailAddress, subject, body);
  }
}

SchedulingNotificationsNamespace.sendScheduledReminders = function() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  const data = sheet.getDataRange().getValues();
  const currentTime = new Date();
  data.forEach(row => {
    const meetingTime = new Date(row[2]);
    const oneHourBeforeMeeting = new Date(meetingTime.getTime() - 60 * 60 * 1000);
    if (currentTime >= oneHourBeforeMeeting && currentTime < meetingTime) {
      SchedulingNotificationsNamespace.sendReminderEmail(row[0]);
    }
  });
}

SchedulingNotificationsNamespace.notifyUser = function(eventType, userId) {
  const emailAddress = SchedulingNotificationsNamespace.getUserEmail(userId);
  const subject = 'Notification: ' + eventType;
  const body = 'Dear user, there is an update regarding your ' + eventType + '. Please check your PRM system for details.';
  MailApp.sendEmail(emailAddress, subject, body);
}

SchedulingNotificationsNamespace.cancelMeeting = function(meetingId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  const data = sheet.getDataRange().getValues();
  const rowIndex = data.findIndex(row => row[0] === meetingId);
  if (rowIndex !== -1) {
    const meetingData = data[rowIndex];
    sheet.deleteRow(rowIndex + 1);
    
    const calendar = CalendarApp.getDefaultCalendar();
    const events = calendar.getEvents(new Date(meetingData[2]), new Date(new Date(meetingData[2]).getTime() + 60 * 60 * 1000));
    events.forEach(event => {
      if (event.getTitle() === 'Meeting with Partner ' + meetingData[1]) {
        event.deleteEvent();
      }
    });
  }
}

SchedulingNotificationsNamespace.generateMeetingId = function() {
  return 'MTG-' + new Date().getTime();
}

SchedulingNotificationsNamespace.getPartnerEmail = function(partnerId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Partners');
  const data = sheet.getDataRange().getValues();
  const partner = data.find(row => row[0] === partnerId);
  return partner ? partner[1] : null;
}

SchedulingNotificationsNamespace.getUserEmail = function(userId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  const user = data.find(row => row[0] === userId);
  return user ? user[1] : null;
}