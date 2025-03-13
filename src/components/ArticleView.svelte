<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { getArticleById } from '../services/db';
  
  export let id;
  
  let article = null;
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      article = await getArticleById(id);
      if (!article) {
        error = "L'article n'a pas été trouvé";
      }
    } catch (err) {
      error = "Une erreur s'est produite lors du chargement de l'article";
      console.error(err);
    } finally {
      loading = false;
    }
  });
  
  function editArticle() {
    navigate(`/editor/${id}`);
  }
  
  function goBack() {
    navigate('/articles');
  }
</script>

{#if loading}
  <p>Chargement de l'article...</p>
{:else if error}
  <div class="error">
    <p>{error}</p>
    <button on:click={goBack}>Retour à la liste des articles</button>
  </div>
{:else}
  <article>
    <header>
      <h1>{article.title}</h1>
      <div class="meta">
        <p>
          Publié le {new Date(article.date).toLocaleDateString()}
          {#if article.category}
            dans <span class="category">{article.category}</span>
          {/if}
          {#if article.status === 'draft'}
            <span class="status draft">Brouillon</span>
          {:else if article.status === 'published'}
            <span class="status published">Publié</span>
          {:else if article.status === 'archived'}
            <span class="status archived">Archivé</span>
          {/if}
        </p>
        
        {#if article.tags && article.tags.length > 0}
          <div class="tags">
            {#each article.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        {/if}
      </div>
    </header>
    
    <div class="content">
      {#each article.content.split('\n') as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>
    
    <div class="actions">
      <button on:click={goBack}>Retour à la liste</button>
      {#if article.status !== 'archived'}
        <button class="edit" on:click={editArticle}>Modifier l'article</button>
      {/if}
    </div>
  </article>
{/if}

<style>
  article {
    max-width: 800px;
    margin: 0 auto;
  }
  
  header {
    margin-bottom: 2rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
  
  .meta {
    color: #666;
    font-size: 0.9rem;
  }
  
  .category {
    background-color: #f0f0f0;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
  }
  
  .status {
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    color: white;
    margin-left: 0.5rem;
  }
  
  .status.draft {
    background-color: #999;
  }
  
  .status.published {
    background-color: #5cb85c;
  }
  
  .status.archived {
    background-color: #f0ad4e;
  }
  
  .tags {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    background-color: #f0f0f0;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.85rem;
  }
  
  .content {
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 3px;
    background-color: #f0f0f0;
    cursor: pointer;
  }
  
  button.edit {
    background-color: #0066cc;
    color: white;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  .error {
    color: #cc0000;
    text-align: center;
    margin: 2rem 0;
  }
</style>