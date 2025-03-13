<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { saveArticle, getArticleById, getAllCategories, saveCategory } from '../services/db';
  
  export let id = null;
  
  let article = {
    title: '',
    content: '',
    category: '',
    status: 'draft',
    tags: []
  };
  
  let newTag = '';
  let newCategory = '';
  let categories = [];
  let isEditing = false;
  let isArchived = false;
  let isLoading = true;
  
  onMount(async () => {
    try {
      console.log("ArticleEditor - onMount démarré");
      
      // Chargement des catégories
      categories = await getAllCategories() || [];
      console.log("Catégories chargées:", categories);
      
      // Si un ID est fourni, charger l'article
      if (id) {
        console.log("Chargement de l'article avec ID:", id);
        const loadedArticle = await getArticleById(id);
        if (loadedArticle) {
          article = loadedArticle;
          isEditing = true;
          isArchived = article.status === 'archived';
          
          // Conversion des tags en tableau si nécessaire
          if (typeof article.tags === 'string') {
            article.tags = article.tags.split(',').map(tag => tag.trim()).filter(Boolean);
          } else if (!Array.isArray(article.tags)) {
            article.tags = [];
          }
          console.log("Article chargé:", article);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      isLoading = false;
      console.log("ArticleEditor - onMount terminé");
    }
  });
  
  async function handleSubmit() {
    try {
      // Validation basique
      if (!article.title.trim()) {
        alert('Le titre est obligatoire');
        return;
      }
      
      if (!article.content.trim()) {
        alert('Le contenu est obligatoire');
        return;
      }
      
      // Sauvegarde de l'article
      const savedArticle = await saveArticle(article);
      
      // Redirection vers la vue de l'article
      navigate(`/article/${savedArticle.id}`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article:", error);
      alert('Une erreur est survenue lors de la sauvegarde');
    }
  }
  
  function addTag() {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      article.tags = [...article.tags, newTag.trim()];
      newTag = '';
    }
  }
  
  function removeTag(tag) {
    article.tags = article.tags.filter(t => t !== tag);
  }
  
  async function addCategory() {
    if (newCategory.trim() && !categories.some(c => (c.name || c) === newCategory.trim())) {
      try {
        const category = { name: newCategory.trim() };
        await saveCategory(category);
        categories = [...categories, category];
        article.category = newCategory.trim();
        newCategory = '';
      } catch (error) {
        console.error("Erreur lors de l'ajout de la catégorie:", error);
      }
    }
  }
  
  function publishArticle() {
    article.status = 'published';
    handleSubmit();
  }
  
  function archiveArticle() {
    article.status = 'archived';
    handleSubmit();
  }
</script>

{#if isLoading}
  <p>Chargement de l'éditeur...</p>
{:else}
  <h1>{isEditing ? 'Modifier l\'article' : 'Nouvel article'}</h1>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="title">Titre</label>
      <input 
        type="text" 
        id="title" 
        bind:value={article.title} 
        required 
        disabled={isArchived}
      />
    </div>
    
    <div class="form-group">
      <label for="content">Contenu</label>
      <textarea 
        id="content" 
        bind:value={article.content} 
        rows="15" 
        required 
        disabled={isArchived}
      ></textarea>
    </div>
    
    <div class="form-group">
      <label for="category">Catégorie</label>
      <div class="category-input">
        <select 
          id="category" 
          bind:value={article.category}
          disabled={isArchived}
        >
          <option value="">-- Sélectionner une catégorie --</option>
          {#each categories as category}
            <option value={category.name || category}>{category.name || category}</option>
          {/each}
        </select>
        
        {#if !isArchived}
          <div class="new-category">
            <input 
              type="text" 
              placeholder="Nouvelle catégorie" 
              bind:value={newCategory} 
            />
            <button type="button" on:click={addCategory}>Ajouter</button>
          </div>
        {/if}
      </div>
    </div>
    
    <div class="form-group">
      <label>Mots-clefs</label>
      <div class="tags-container">
        {#each article.tags as tag}
          <span class="tag">
            {tag}
            {#if !isArchived}
              <button type="button" on:click={() => removeTag(tag)}>×</button>
            {/if}
          </span>
        {/each}
      </div>
      
      {#if !isArchived}
        <div class="new-tag">
          <input 
            type="text" 
            placeholder="Ajouter un mot-clef" 
            bind:value={newTag} 
            on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <button type="button" on:click={addTag}>Ajouter</button>
        </div>
      {/if}
    </div>
    
    <div class="form-group">
      <label for="status">Statut</label>
      <select 
        id="status" 
        bind:value={article.status}
        disabled={isArchived}
      >
        <option value="draft">Brouillon</option>
        <option value="published">Publié</option>
        <option value="archived">Archivé</option>
      </select>
    </div>
    
    <div class="actions">
      {#if !isArchived}
        <button type="submit">Enregistrer comme brouillon</button>
        <button type="button" on:click={publishArticle}>Publier</button>
        {#if isEditing}
          <button type="button" class="archive" on:click={archiveArticle}>Archiver</button>
        {/if}
      {:else}
        <p class="archived-notice">Cet article est archivé et ne peut plus être modifié.</p>
      {/if}
      <button type="button" class="cancel" on:click={() => navigate('/articles')}>Annuler</button>
    </div>
  </form>
{/if}

<style>
  form {
    max-width: 800px;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  input[type="text"],
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  
  .category-input,
  .new-category,
  .new-tag {
    display: flex;
    gap: 0.5rem;
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .tag {
    display: inline-flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 0.3rem 0.6rem;
    border-radius: 3px;
  }
  
  .tag button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 0 0 0.3rem;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  button[type="submit"] {
    background-color: #0066cc;
    color: white;
  }
  
  button[type="submit"]:hover {
    background-color: #0055aa;
  }
  
  button.cancel {
    background-color: #f0f0f0;
    color: #333;
  }
  
  button.archive {
    background-color: #f0ad4e;
    color: white;
  }
  
  .archived-notice {
    color: #cc0000;
    font-style: italic;
  }
</style>