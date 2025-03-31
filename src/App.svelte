<script lang="ts">
  import "@gzlab/uui/main.css";
  import FileInput from "./FileInput.svelte";
  import Table from "./components/Table.svelte";
  import { file, pagesData } from "./lib/store";
</script>

<main class="cont mx-auto p-4">
  <div class="mb-8">
    <FileInput
      label="Upload File"
      bind:file={$file}
      name="file"
      accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
    />
  </div>

  {#if $pagesData}
    <!-- <div class="space-y-8">
        {#each Object.entries($pagesData).sort(([a], [b]) => Number(a) - Number(b)) as [pageNum, page]}
          <Page {page} />
        {/each}
      </div> -->
    <div class="overflow-x-auto">
      <Table pages={$pagesData} />
    </div>
  {/if}
</main>

<style>
  .cont {
    max-width: 1200px;
  }
</style>
