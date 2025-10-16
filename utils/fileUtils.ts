
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result is a data URL like "data:image/jpeg;base64,..."
        // We only want the base64 part.
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert blob to base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};
