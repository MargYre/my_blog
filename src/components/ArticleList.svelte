
<script>
  import { onMount } from 'svelte';
  import { getAllArticles, deleteArticle } from '../services/db';
  import { navigate } from 'svelte-routing';
  
  let articles = [];
  let filteredArticles = [];
  let statusFilter = 'all';
  let categoryFilter = 'all';
  let categories = [];
  
  onMount(async () => {
    await loadArticles();
  });
  
  async function loadArticles() {
    try {
      articles = await getAllArticles();
      
      // Extraction des catégories uniques
      categories = [...new Set(articles.map(article => article.category).filter(Boolean))];
      
      applyFilters();
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
    }
  }
  
  function applyFilters() {
    filteredArticles = articles.filter(article => {
      // Filtre par statut
      if (statusFilter !== 'all' && article.status !== statusFilter) {
        return false;
      }
      
      // Filtre par catégorie
      if (categoryFilter !== 'all' && article.category !== categoryFilter) {
        return false;
      }
      
      return true;
    });
    
    // Tri par date (plus récent en premier)
    filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  async function handleDelete(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteArticle(id);
        await loadArticles();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
      }
    }
  }
  
  function editArticle(id) {
    navigate(`/editor/${id}`);
  }
  
  function viewArticle(id) {
    navigate(`/article/${id}`);
  }
</script>

<h1>Tous les Articles</h1>

<div class="filters">
  <div>
    <label for="status">Statut:</label>
    <select id="status" bind:value={statusFilter} on:change={applyFilters}>
      <option value="all">Tous</option>
      <option value="draft">Brouillons</option>
      <option value="published">Publiés</option>
      <option value="archived">Archivés</option>
    </select>
  </div>
  
  <div>
    <label for="category">Catégorie:</label>
    <select id="category" bind:value={categoryFilter} on:change={applyFilters}>
      <option value="all">Toutes</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>
</div>

{#if filteredArticles.length > 0}
  <table>
    <thead>
      <tr>
        <th>Titre</th>
        <th>Date</th>
        <th>Catégorie</th>
        <th>Statut</th>
        <th>Mots-clefs</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredArticles as article}
        <tr>
          <td>{article.title}</td>
          <td>{new Date(article.date).toLocaleDateString()}</td>
          <td>{article.category || '-'}</td>
          <td>
            {#if article.status === 'draft'}
              Brouillon
            {:else if article.status === 'published'}
              Publié
            {:else if article.status === 'archived'}
              Archivé
            {/if}
          </td>
          <td>
            {#if article.tags && article.tags.length > 0}
              {article.tags.join(', ')}
            {:else}
              -
            {/if}
          </td>
          <td class="actions">
            <button on:click={() => viewArticle(article.id)}>Voir</button>
            {#if article.status !== 'archived'}
              <button on:click={() => editArticle(article.id)}>Modifier</button>
            {/if}
            <button class="delete" on:click={() => handleDelete(article.id)}>Supprimer</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>Aucun article trouvé.</p>
{/if}

<div class="actions">
  <button on:click={() => navigate('/editor')}>Nouvel Article</button>
</div>

<style>
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  th, td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f0f0f0;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    background-color: #0066cc;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    border-radius: 3px;
    font-size: 0.9rem;
  }
  
  button:hover {
    background-color: #0055aa;
  }
  
  button.delete {
    background-color: #cc0000;
  }
  
  button.delete:hover {
    background-color: #aa0000;
  }
</style>