function myFunction() {
  
  //first task
  var date = new Date();
  var month = date.getMonth();
  month = ( month + 11 ) % 12;
  month = month + 1;
  
  var files = DriveApp.getFilesByName(ORIGIN_FILE_NAME);
  var source;
  
  if ( files.hasNext() ) {
    source = files.next();
  }
  month = month <10 ? "0"+month:month;
  
  //second task
  var newFile = source.makeCopy( month + "_" + ORIGIN_FILE_NAME);
  
  //3rd task
  var doc = DocumentApp.openById(newFile.getId());
  var body = doc.getBody();
  var tables = body.getTables();
  if ( tables.length < 1 ) return;
  //get the second table
  var price_table = tables[2];
  var numRows = price_table.getNumRows();
  
  //Open the Spreadsheet file
  var sData = getSpreadData();
  for ( var I = 0 ; I<15 ; I ++ ) {
    price_table.getCell(I+1,2).setText(sData["a"][I]);
    price_table.getCell(I+1,3).setText(sData["b"][I]);
  }
  
  //4th task
  var data_table = tables[1];
  var monthStr = (date.getMonth() + 11)%12 < 10 ? "0" + (date.getMonth() + 11)%12 : (date.getMonth() + 11)%12 
  data_table.getCell(0,0).setText("Number: AAA" + monthStr);
  var dayStr = (date.getDate() + 1) < 10 ? "0" + (date.getDate() + 1) : (date.getDate() + 1);
  data_table.getCell(0,1).setText("Date: " + MONTH[(date.getMonth() + 11)%12] + " " + dayStr + ", " + date.getFullYear());
  
  //find last String
  
  body.findText("Payment due by MMM 15, YYYY").getElement().asText().setText("Payment Details :\tPayment due by " + MONTH[(date.getMonth() + 11)%12] + " 15, " + date.getFullYear());
  
  //final task
  var Owner = source.getOwner();
  var OwnerEmail = Owner.getEmail();
  doc.saveAndClose();
  var pdfFile = newFile.getAs(MimeType.PDF);
  GmailApp.sendEmail("yunaandvann@gmail.com", "PDF result", "PDF result from Darina", {
    attachments: [pdfFile],
    name: doc.getName()
  });
}


function getFileBlob(filename) {
  var files = DriveApp.getFilesByName(filename);
  var source;
  
  if ( files.hasNext() ) {
    source = files.next();
  }
  source.makeCopy("bbbb");
  return source.getBlob();
}

function getFileId(filename) {
  var files = DriveApp.getFilesByName(filename);
  var source;
  if ( files.hasNext() ) {
    source = files.next();
  }
  return source.getId();
}

function getSpreadData(){
  var ret = {
    a : [],
    b : []
  };
  //get File id
  var files = DriveApp.getFilesByName(SPREADSHEET_FILE_NAME);
  var source;
  if ( files.hasNext() ) {
    source = files.next();
  }
  var id = source.getId();
  
  //read Sheet from Id
  
  var workspace = SpreadsheetApp.openById(id);
  var sheets = workspace.getSheets();
  var sheet = sheets[0];
  for ( var I = 0 ;I< 15; I ++ )
  {
    ret["a"][I] = sheet.getRange(17-I,5).getValue();
    ret["b"][I] = sheet.getRange(17-I,6).getValue();
  }
  return ret;
}
