function doGet(e) {
  spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  spreadsheetName = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_NAME');
  
  //リクエストパラメータの取得
  const contactPersonName = e.parameter.contact_person_name;
  const mailAddress = e.parameter.mail_address;
  const contactComment = e.parameter.contact_comment;
  
  if(!contactPersonName || !mailAddress || !contactComment) {
    Logger.log("パラメータの取得に失敗");
    return generateResponse(false);
  }
  
  try{
    spreadsheetWrite(contactPersonName, mailAddress, contactComment);
  } catch(e) {
    Logger.log("スプレッドシートへの挿入に失敗:" + e);
    return generateResponse(false);
  }
  
  Logger.log("スプレッドシートへの挿入に成功");
  return generateResponse(true);
}

// レスポンスJSON生成
function generateResponse(isSuccess) {
  const message = isSuccess ? "contact_success" : "contact_error";
  const result = { redirect: message };
  const out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  return out.setContent(JSON.stringify(result));
}

//スプレッドシートへ挿入
function spreadsheetWrite(contactPersonName, mailAddress, contactComment){
  const nowDate = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd : HH-mm-ss');
  contactPersonName = escapStr(contactPersonName);
  mailAddress = escapStr(mailAddress);
  contactComment = escapStr(contactComment);
  Logger.log("名前 : %s, メールアドレス : %s, 問い合わせ日時 : %s, 問い合わせ内容 : %s", contactPersonName, mailAddress, nowDate, contactComment);
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(spreadsheetName);
  sheet.appendRow([contactPersonName, mailAddress, nowDate, contactComment]);
}

//特殊文字列をエスケープ
function escapStr(str){
  return str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
}