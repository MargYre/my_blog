// Service pour gérer la base de données IndexedDB

// Initialisation de la base de données
export async function initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDB', 1);
      
      request.onerror = (event) => {
        reject('Erreur lors de l\'ouverture de la base de données');
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Création du store pour les articles
        if (!db.objectStoreNames.contains('articles')) {
          const articleStore = db.createObjectStore('articles', { keyPath: 'id' });
          articleStore.createIndex('date', 'date', { unique: false });
          articleStore.createIndex('status', 'status', { unique: false });
          articleStore.createIndex('category', 'category', { unique: false });
        }
  
        // Création du store pour les catégories
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        }
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }
  
  // Génération d'un identifiant unique pour chaque article
  export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  // Récupération de tous les articles
  export async function getAllArticles() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDB', 1);
      
      request.onerror = (event) => {
        reject('Erreur lors de l\'ouverture de la base de données');
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['articles'], 'readonly');
        const objectStore = transaction.objectStore('articles');
        const request = objectStore.getAll();
        
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        
        request.onerror = (event) => {
          reject('Erreur lors de la récupération des articles');
        };
      };
    });
  }
  
  // Récupération d'un article par son ID
  export async function getArticleById(id) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDB', 1);
      
      request.onerror = (event) => {
        reject('Erreur lors de l\'ouverture de la base de données');
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['articles'], 'readonly');
        const objectStore = transaction.objectStore('articles');
        const request = objectStore.get(id);
        
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        
        request.onerror = (event) => {
          reject('Erreur lors de la récupération de l\'article');
        };
      };
    });
  }
  
  // Sauvegarde d'un article
  export async function saveArticle(article) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDB', 1);
      
      request.onerror = (event) => {
        reject('Erreur lors de l\'ouverture de la base de données');
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['articles'], 'readwrite');
        const objectStore = transaction.objectStore('articles');
        
        // Génération d'un nouvel ID si nécessaire
        if (!article.id) {
          article.id = generateUniqueId();
        }
        
        // Ajout de la date de création si elle n'existe pas
        if (!article.date) {
          article.date = new Date().toISOString();
        }
        
        const request = objectStore.put(article);
        
        request.onsuccess = (event) => {
          resolve(article);
        };
        
        request.onerror = (event) => {
          reject('Erreur lors de la sauvegarde de l\'article');
        };
      };
    });
  }
  
  // Suppression d'un article
  export async function deleteArticle(id) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDB', 1);
      
      request.onerror = (event) => {
        reject('Erreur lors de l\'ouverture de la base de données');
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['articles'], 'readwrite');
        const objectStore = transaction.objectStore('articles');
        const request = objectStore.delete(id);
        
        request.onsuccess = (event) => {
          resolve(true);
        };
        
        request.onerror = (event) => {
          reject('Erreur lors de la suppression de l\'article');
        };
      };
    });
  }
  
  // Récupération de toutes les catégories
  export async function getAllCategories() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDB', 1);
      
      request.onerror = (event) => {
        reject('Erreur lors de l\'ouverture de la base de données');
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['categories'], 'readonly');
        const objectStore = transaction.objectStore('categories');
        const request = objectStore.getAll();
        
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        
        request.onerror = (event) => {
          reject('Erreur lors de la récupération des catégories');
        };
      };
    });
  }
  
  // Sauvegarde d'une catégorie
  export async function saveCategory(category) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDB', 1);
      
      request.onerror = (event) => {
        reject('Erreur lors de l\'ouverture de la base de données');
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['categories'], 'readwrite');
        const objectStore = transaction.objectStore('categories');
        const request = objectStore.put(category);
        
        request.onsuccess = (event) => {
          resolve(true);
        };
        
        request.onerror = (event) => {
          reject('Erreur lors de la sauvegarde de la catégorie');
        };
      };
    });
  }