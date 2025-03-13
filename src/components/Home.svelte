<script>
  import { onMount } from 'svelte';
  import { getAllArticles } from '../services/db';
  import { navigate } from 'svelte-routing';
  
  let recentArticles = [];
  
  onMount(async () => {
    try {
      const articles = await getAllArticles();
      // Tri des articles par date (les plus récents d'abord) et sélection des 5 premiers
      recentArticles = articles
        .filter(article => article.status === 'published')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    } catch (error) {
      console.error("Erreur lors du chargement des articles récents:", error);
    }
  });
  
  function viewArticle(id) {
    navigate(`/article/${id}`);
  }
</script>

<h1>Bienvenue sur mon Blog</h1>

<section>
  <h2>Articles récents</h2>
  
  {#if recentArticles.length > 0}
    <ul>
      {#each recentArticles as article}
        <li>
          <article>
            <h3>{article.title}</h3>
            <p class="meta">
              Publié le {new Date(article.date).toLocaleDateString()}
              {#if article.category}
                dans <span class="category">{article.category}</span>
              {/if}
            </p>
            <p class="excerpt">{article.content.substring(0, 150)}...</p>
            <button on:click={() => viewArticle(article.id)}>Lire la suite</button>
          </article>
        </li>
      {/each}
    </ul>
  {:else}
    <p>Aucun article publié pour le moment.</p>
  {/if}
</section>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 2rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  .meta {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
  }
  
  .category {
    background-color: #f0f0f0;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
  }
  
  button {
    background-color: #0066cc;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 3px;
  }
  
  button:hover {
    background-color: #0055aa;
  }
</style>