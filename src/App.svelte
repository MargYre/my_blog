<script>
  import { onMount } from 'svelte';
  import { Router, Link, Route } from "svelte-routing";
  import Home from './components/Home.svelte';
  import ArticleList from './components/ArticleList.svelte';
  import ArticleEditor from './components/ArticleEditor.svelte';
  import ArticleView from './components/ArticleView.svelte';
  import { initializeDB } from './services/db';
  
  let dbInitialized = false;
  
  onMount(async () => {
    console.log("Router component:", Router);
    await initializeDB();
    dbInitialized = true;
  });
</script>

{#if dbInitialized}
<Router url={window.location.pathname}>
  <nav>
    <Link to="/">Accueil</Link>
    <Link to="/articles">Articles</Link>
    <Link to="/editor">Nouvel Article</Link>
  </nav>
  <main>
    <Route path="/" component={Home} />
    <Route path="/articles" component={ArticleList} />
    <Route path="/article/:id" component={ArticleView} let:params>
    <ArticleView id={params.id} />
    </Route>
    <Route path="/editor" component={ArticleEditor}/>
    <Route path="/editor/:id" component={ArticleEditor} />
    <Route path="*">
      <div style="padding: 2rem; border: 2px dashed red;">
        <h2>Route non trouvée</h2>
        <p>URL actuelle: {window.location.pathname}</p>
      </div>
    </Route>
  </main>
</Router>
{:else}
  <p>Chargement de la base de données...</p>
{/if}

<style>
  nav {
    padding: 1rem;
    background-color: #f0f0f0;
  }
  
  nav :global(a) {
    margin-right: 1rem;
    text-decoration: none;
    color: #333;
  }
  
  nav :global(a):hover {
    text-decoration: underline;
  }
  
  main {
    padding: 1rem;
  }
</style>