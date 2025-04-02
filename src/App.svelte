<script lang="ts">
  import "@gzlab/uui/main.css";
  import { file, pagesData } from "./lib/store";
  import DynamicTable from "./components/DynamicTable.svelte";
  import Header from "./components/Header.svelte";
  import Summary from "./components/Summary.svelte";
</script>

<main class:center={!$file}>
  <Header />

  {#if $pagesData}
    <Summary />
    <DynamicTable pagesData={$pagesData} />
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin: 0.3rem;
    min-height: calc(100vh - 0.6rem);
  }
  @media print {
    main {
      margin: 0rem;
      max-width: calc();
    }
  }
  .langList {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
</style>
