// ===========================================
// SCRIPT APPS SCRIPT FINAL - CNN 2K25
// GARDE LES PHOTOS DANS GOOGLE DRIVE + URLs ACCESSIBLES
// ===========================================

function doPost(e) {
  try {
    // Parse the form data
    const data = JSON.parse(e.postData.contents);
    
    // Determine which sheet to use based on form type
    let sheet;
    let rowData = [];
    
    if (data.isAlumni || data.formType === 'alumni') {
      // Alumni registration
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Alumni');
      if (!sheet) {
        // Create Alumni sheet if it doesn't exist
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Alumni');
        
        // Add headers for Alumni sheet
        const headers = [
          'Timestamp', 'Full Name', 'Email', 'Phone', 'AIESEC Mandate', 'Attendance',
          'Attendance Type', 'Alumni Character', 'Memory Share', 'Memory Photo URL',
          'Alumni Photo URL', 'Alumni Updates', 'Single Room', 'Has Signature', 'Terms Accepted'
        ];
        
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
      
      // Save photos to Google Drive and get accessible URLs
      let memoryPhotoUrl = '';
      let alumniPhotoUrl = '';
      
      if (data.memoryPhotoData && data.memoryPhotoName && data.memoryPhotoName !== 'Pas de photo de mémoire') {
        memoryPhotoUrl = savePhotoToDriveAndGetUrl(data.memoryPhotoData, data.memoryPhotoName, data.email, data.fullName, 'memory');
      }
      
      if (data.alumniPhotoData && data.alumniPhotoName && data.alumniPhotoName !== 'Pas de photo alumni') {
        alumniPhotoUrl = savePhotoToDriveAndGetUrl(data.alumniPhotoData, data.alumniPhotoName, data.email, data.fullName, 'alumni');
      }
      
      // Prepare alumni data
      rowData = [
        new Date(),
        data.fullName || '',
        data.email || '',
        data.phone || '',
        data.aiesecMandate || '',
        data.attendance || '',
        data.attendanceType || '',
        data.alumniCharacter || '',
        data.memoryShare || '',
        memoryPhotoUrl,
        alumniPhotoUrl,
        data.alumniUpdates || '',
        data.singleRoom || '',
        data.hasSignature || '',
        data.termsAccepted || ''
      ];
    } else {
      // Regular registration
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      // Save photo to Google Drive and get accessible URL
      let photoUrl = '';
      if (data.photoData && data.photoName && data.photoName !== 'Pas de photo') {
        photoUrl = savePhotoToDriveAndGetUrl(data.photoData, data.photoName, data.email, data.fullName, 'regular');
      }
      
      // Prepare regular data - AJOUT DE LA NOUVELLE COLONNE BUS TRANSPORT
      rowData = [
        new Date(),
        data.fullName || '',
        data.aiesecPosition || '',
        data.cin || '',
        data.university || '',
        data.email || '',
        data.phone || '',
        data.emergencyPhone || '',
        data.gender || '',
        data.genderOther || '',
        data.dateOfBirth || '',
        data.allergies || '',
        data.medicalConditions || '',
        data.medicalConditionsOther || '',
        data.wonderlandCharacter || '',
        data.mainGoals || '',
        data.interestedTopics || '',
        data.teamSupport || '',
        data.communicationMethod || '',
        data.communicationMethodOther || '',
        photoUrl,
        data.finalComments || '',
        data.singleRoom || '',
        data.busTransport || '',  // ← NOUVELLE COLONNE AJOUTÉE ICI
        data.hasSignature || '',
        data.termsAccepted || ''
      ];
    }
    
    // Add data to sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', message: 'Data saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to save photos to Google Drive and return accessible URL
function savePhotoToDriveAndGetUrl(base64Data, fileName, email, fullName, type) {
  try {
    // Remove the data URL prefix
    const base64Image = base64Data.split(',')[1];
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Image),
      'image/jpeg',
      `${type}_${fullName}_${fileName}`
    );
    
    // Create folder structure for photos
    const folderId = '1xj9gozv4Xj2NYGo5oNoOujdfjiztv1JW'; // Your Google Drive folder ID
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    
    // Make the file publicly accessible
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Get the file ID and create accessible URL
    const fileId = file.getId();
    
    // Return multiple URL formats for maximum compatibility
    const accessibleUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    
    // Also try the direct Google Drive format
    const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    
    // Return the most accessible URL
    return accessibleUrl;
    
  } catch (error) {
    console.error('Error saving photo to Drive:', error);
    // Fallback to placeholder if Google Drive fails
    const encodedName = encodeURIComponent(fullName || 'Participant');
    return `https://placehold.co/300x300/1e293b/fbbf24?text=${encodedName}`;
  }
}

// Function to get all participants (regular + alumni) for the gallery
function doGet() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get regular participants
    const regularSheet = spreadsheet.getSheetByName('Registrations') || spreadsheet.getActiveSheet();
    const regularData = regularSheet.getDataRange().getValues();
    
    let regularParticipants = [];
    if (regularData.length > 1) {
      const regularHeaders = regularData[0];
      regularParticipants = regularData.slice(1).map(row => {
        const participant = {};
        regularHeaders.forEach((header, index) => {
          const key = header.toLowerCase().replace(/\s+/g, '');
          const camelKey = header.replace(/\s+(.)/g, (match, letter) => letter.toUpperCase());
          const originalKey = header;
          
          // Stocker avec toutes les variations possibles
          participant[key] = row[index];
          participant[camelKey] = row[index];
          participant[originalKey] = row[index];
          
          // Ajouter les variations spécifiques pour les URLs de photos
          if (header === 'Photo URL') {
            participant.photoUrl = row[index];
            participant.photourl = row[index];
            participant.photo_url = row[index];
          }
        });
        participant.formType = 'regular';
        participant.isAlumni = false;
        return participant;
      });
    }
    
    // Get alumni participants
    const alumniSheet = spreadsheet.getSheetByName('Alumni');
    let alumniParticipants = [];
    
    if (alumniSheet && alumniSheet.getLastRow() > 1) {
      const alumniData = alumniSheet.getDataRange().getValues();
      const alumniHeaders = alumniData[0];
      alumniParticipants = alumniData.slice(1).map(row => {
        const participant = {};
        alumniHeaders.forEach((header, index) => {
          const key = header.toLowerCase().replace(/\s+/g, '');
          const camelKey = header.replace(/\s+(.)/g, (match, letter) => letter.toUpperCase());
          const originalKey = header;
          
          // Stocker avec toutes les variations possibles
          participant[key] = row[index];
          participant[camelKey] = row[index];
          participant[originalKey] = row[index];
          
          // Ajouter les variations spécifiques pour les URLs de photos alumni
          if (header === 'Alumni Photo URL') {
            participant.alumniPhotoUrl = row[index];
            participant.alumniphotourl = row[index];
            participant.alumni_photo_url = row[index];
          }
          if (header === 'Memory Photo URL') {
            participant.memoryPhotoUrl = row[index];
            participant.memoryphotourl = row[index];
            participant.memory_photo_url = row[index];
          }
        });
        participant.formType = 'alumni';
        participant.isAlumni = true;
        return participant;
      });
    }
    
    // Combine both types
    const allParticipants = [...regularParticipants, ...alumniParticipants];
    
    return ContentService
      .createTextOutput(JSON.stringify({participants: allParticipants}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
