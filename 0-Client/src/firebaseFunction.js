import { ref, push, get, set, remove } from "firebase/database";
import { realtimeDb } from './firebase';

const updateVisitedVideos = (userId, videoUrl) => {
  try {
    const dbRef = ref(realtimeDb, 'users/' + userId + '/visitedVideos'); // Create a reference to the path

    // Use push to add a new item to the array
    push(dbRef, videoUrl)
      .then(() => {
        console.log('Visited video added successfully!');
      })
      .catch((error) => {
        console.error(error.message);
      });
  } catch (error) {
    console.error('Error adding visited video:', error);
  }
};

const getVisitedVideos = async (userId) => {
  try {
    const userRef = ref(realtimeDb, 'users/' + userId); // Create a reference to the user

    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const visitedVideos = userData.visitedVideos || [];
      return Object.values(visitedVideos);
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching visited videos:', error);
    return [];
  }
};

const clearVisitedVideos = async (userId) => {
  try {
    const userRef = ref(realtimeDb, `users/${userId}/visitedVideos`); // Reference to the visitedVideos field
    await set(userRef, null); // Clear the field by setting it to null
    console.log('Visited videos cleared successfully!');
  } catch (error) {
    console.error('Error clearing visited videos:', error);
  }
};

const getUserCategoriesOfInterest = async (userId) => {
  try {
    const userRef = ref(realtimeDb, 'users/' + userId); // Create a reference to the user

    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const categoriesOfInterest = userData.categoriesOfInterest;
      return Object.values(categoriesOfInterest);
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories of interest:', error);
    return [];
  }
};

const getUserLanguageLevel = async (userId) => {
  try {
    const userRef = ref(realtimeDb, 'users/' + userId); // Create a reference to the user
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const languageLevel = userData.languageLevel;

      // Directly return the string if it's not an object
      if (typeof languageLevel === 'string') {
        return languageLevel; // Return the string directly
      } else {
        console.warn('Unexpected format for languageLevel:', languageLevel);
        return null; // Handle unexpected cases
      }
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error('Error fetching language level:', error);
    return null;
  }
};

const addCategoryOfInterest = (userId, category) => {
  const dbRef = ref(realtimeDb, `users/${userId}/categoriesOfInterest`);
  get(dbRef).then((snapshot) => {
    let currentCategories = snapshot.exists() ? snapshot.val() : [];
    if (typeof currentCategories === 'string') { // Handle legacy single string data
      currentCategories = [currentCategories];
    }
    if (!currentCategories.includes(category)) { // Ensure no duplicates
      currentCategories.push(category);
      set(dbRef, currentCategories)
        .then(() => console.log('Category added successfully!'))
        .catch((error) => console.error('Error adding category:', error));
    }
  });
};

const getUserLearningLanguage = async (userId) => {
  try {
    const userRef = ref(realtimeDb, 'users/' + userId); // Create a reference to the user
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const learningLanguage = userData.learningLanguage;

      // Directly return the string if it's not an object
      if (typeof learningLanguage === 'string') {
        return learningLanguage; // Return the string directly
      } else {
        console.warn('Unexpected format for learningLanguage:', learningLanguage);
        return null; // Handle unexpected cases
      }
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    console.error('Error fetching learning language:', error);
    return null;
  }
}

const addLanguageLevel = (userId, languageLevel) => {
  try {
    const dbRef = ref(realtimeDb, 'users/' + userId + '/languageLevel'); // Create a reference to the user

    set(dbRef, languageLevel)
      .then(() => {
        console.log('Language level added successfully!');
      })
      .catch((error) => {
        console.error(error.message);
      });
  } catch (error) {
    console.error('Error adding language level:', error);
  }
};

const addLearningLanguage = (userId, learningLanguage) => {
  try {
    const dbRef = ref(realtimeDb, 'users/' + userId + '/learningLanguage'); // Create a reference to the user

    set(dbRef, learningLanguage)
      .then(() => {
        console.log('Learning language added successfully!');
      })
      .catch((error) => {
        console.error(error.message);
      });
  } catch (error) {
    console.error('Error adding learning language:', error);
  }
};

export {
  updateVisitedVideos,
  getVisitedVideos,
  clearVisitedVideos, // Export the new function
  addCategoryOfInterest,
  addLanguageLevel,
  getUserCategoriesOfInterest,
  getUserLanguageLevel,
  addLearningLanguage,
  getUserLearningLanguage
};
