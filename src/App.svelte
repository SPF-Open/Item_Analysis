<script lang="ts">
  import "@gzlab/uui/main.css";
  import FileInput from "./FileInput.svelte";
  import { file, pagesData } from "./lib/store";
  import DynamicTable from "./components/DynamicTable.svelte";
  import Summary from "./components/Summary.svelte";
</script>

<main>
  <div class="mb-8 hide-print">
    <FileInput
      label="Upload File"
      bind:file={$file}
      name="file"
      accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
    />
  </div>

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
  }
  @media print {
    main {
      margin: 0rem;
      max-width: calc();
    }
  }
</style>
