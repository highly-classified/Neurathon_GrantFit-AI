
import { db, storage, auth } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const createRegistration = async (userId, registrationData, file) => {
  try {
    // 1. Upload File (if present)
    let downloadUrl = null;
    let storagePath = null;

    if (file) {
      const timestamp = Date.now();
      storagePath = `proposals/${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;
      downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    }

    // 2. Create Firestore Record
    const registrationId = `REG_${Date.now()}`;
    const registrationRef = doc(db, 'users', userId, 'registrations', registrationId);

    const data = {
      ...registrationData,
      id: registrationId,
      status: 'Applied',
      submittedAt: serverTimestamp(),
      documentUrl: downloadUrl,
      documentPath: storagePath,
      userId: userId
    };

    await setDoc(registrationRef, data);
    return { success: true, id: registrationId };

  } catch (error) {
    console.error("Error creating registration:", error);
    throw error;
  }
};
