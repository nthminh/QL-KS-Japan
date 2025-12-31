// Google Drive Service
// This service helps with generating Google Drive folder links

// The shared Google Drive folder ID from the link
// https://drive.google.com/drive/folders/11XtTyW0H15tleBZTNiDVOVhLJJERxFv6?usp=drive_link
const SHARED_DRIVE_FOLDER_ID = '11XtTyW0H15tleBZTNiDVOVhLJJERxFv6';

export const driveService = {
  /**
   * Generates a folder name based on candidate name and date of birth
   * Format: "Name_YYYYMMDD"
   * @param {string} name - Candidate's name
   * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
   * @returns {string} Folder name
   */
  generateFolderName(name, dateOfBirth) {
    if (!name || !dateOfBirth) return '';
    // Remove special characters and replace with underscore
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
    // Format date as YYYYMMDD
    const cleanDate = dateOfBirth.replace(/-/g, '');
    return `${cleanName}_${cleanDate}`;
  },

  /**
   * Gets the main shared Google Drive folder link
   * @returns {string} Google Drive folder link
   */
  getSharedDriveLink() {
    return `https://drive.google.com/drive/folders/${SHARED_DRIVE_FOLDER_ID}`;
  },

  /**
   * Generates a search link for a specific folder name in the shared drive
   * Note: This doesn't create the folder automatically, but provides a link to search for it
   * The folder should be created manually in Google Drive with this exact name
   * @param {string} folderName - The folder name to search for
   * @returns {string} Google Drive search link
   */
  getFolderSearchLink(folderName) {
    if (!folderName) return this.getSharedDriveLink();
    // Encode the search query
    const searchQuery = encodeURIComponent(folderName);
    return `https://drive.google.com/drive/folders/${SHARED_DRIVE_FOLDER_ID}?q=${searchQuery}`;
  },

  /**
   * Gets instructions for creating a folder
   * @param {string} folderName - The folder name
   * @returns {string} Instructions text
   */
  getFolderInstructions(folderName) {
    return `Tạo thư mục với tên: "${folderName}" trong Google Drive chung tại: ${this.getSharedDriveLink()}`;
  }
};
