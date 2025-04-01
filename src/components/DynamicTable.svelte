<script lang="ts">
  import { Button, Card, Switch, Table } from "@gzlab/uui";
  import type { PageInfo } from "../lib/store";
  import { visibleColumns } from "./DynamicTable";

  export let pagesData: Record<number, PageInfo>;

  // Define the structure of a column (excluding alternatives)
  type Column = {
    id: string;
    label: string;
    renderer: (row: any) => string;
  };

  // Configure your columns here (the renderer formats the cell value)
  let columns: Column[] = [
    { id: "page", label: "Page", renderer: (row) => row.page },
    { id: "itemRank", label: "Item", renderer: (row) => row.itemRank },
    { id: "instruction", label: "Instruction", renderer: (row) => row.instruction },
    { id: "duration_mean", label: "Duration Mean", renderer: (row) => row.duration_mean.toFixed(2) + "s" },
    { id: "duration_sd", label: "Duration SD", renderer: (row) => row.duration_sd.toFixed(2) + "s" },
    { id: "testCode", label: "Test Code", renderer: (row) => row.testCode },
    { id: "diplome", label: "Diploma", renderer: (row) => row.diplome },
    { id: "nCandidates", label: "N Candidates", renderer: (row) => row.nCandidates },
    { id: "correct_pct", label: "Correct %", renderer: (row) => row.correct_pct.toFixed(2) + "%" },
    { id: "incorrect_pct", label: "Incorrect %", renderer: (row) => row.incorrect_pct.toFixed(2) + "%" },
    { id: "empty_pct", label: "Empty %", renderer: (row) => row.empty_pct.toFixed(2) + "%" },
    { id: "not_seen_pct", label: "Not Seen %", renderer: (row) => row.not_seen_pct.toFixed(2) + "%" },
    { id: "answered_pct", label: "Answered %", renderer: (row) => row.answered_pct.toFixed(2) + "%" },
    { id: "difficulty", label: "Difficulty", renderer: (row) => row.difficulty.toFixed(4) },
    { id: "discr_comp", label: "Discr Comp", renderer: (row) => row.discr_comp.toFixed(4) },
    { id: "discr_test", label: "Discr Test", renderer: (row) => row.discr_test.toFixed(4) },
    { id: "d_index_comp", label: "D-Index Comp", renderer: (row) => row.d_index_comp.toFixed(4) },
    { id: "d_index_test", label: "D-Index Test", renderer: (row) => row.d_index_test.toFixed(4) }
  ];

  // Toggle for the alternatives column(s)
  let showAlternatives = true;

  // Control to show or hide the column toggle menu
  let showToggleMenu = false;

  // Define groups with associated column IDs
  const groups = [
    { label: "Candidats", ids: ["diplome", "nCandidates"] },
    { label: "Difficulté", ids: ["correct_pct", "incorrect_pct"] },
    { label: "Abstentions", ids: ["empty_pct", "not_seen_pct", "answered_pct"] },
    { label: "Indices", ids: ["difficulty", "discr_comp", "discr_test", "d_index_comp", "d_index_test"] },
  ];

  // Create a set of all grouped column IDs
  const groupedIds = new Set(groups.flatMap(group => group.ids));

  // Non-grouped columns are those not part of any group
  const nonGroupColumns = columns.filter(col => !groupedIds.has(col.id));

  // Mapping from column id to column object
  let colMap: Record<string, Column> = {};
  columns.forEach(col => {
    colMap[col.id] = col;
  });

  // Flatten page data for table display
  $: rows = Object.values(pagesData).flatMap((page) =>
    page.questions.map((question) => ({
      ...question,
      // Ensure to add page-level data so the renderer functions work
      page: page.page ?? "",
      instruction: page.instruction,
      duration_mean: page.duration.mean,
      duration_sd: page.duration.sd,
    }))
  );
</script>

<div class="hide-print">
  <Card>
    <svelte:fragment slot="title">
      <Button onClick={() => (showToggleMenu = !showToggleMenu)} type="info">
        {#if showToggleMenu}Hide Column Menu{:else}Show Column Menu{/if}
      </Button>
    </svelte:fragment>
    {#if showToggleMenu}
      <div>
        <h3>Toggle Columns</h3>
        <div class="switchs">
          {#each Object.keys(visibleColumns) as colId}
            <label class="switch">
              <Switch bind:checked={visibleColumns[colId]} />
              <span>{colId}</span>
            </label>
          {/each}
          <label class="switch">
            <Switch bind:checked={showAlternatives} />
            <span> Alternatives</span>
          </label>
        </div>
      </div>
    {/if}
  </Card>
</div>

<div class="table new-page">
  <Table>
    <thead>
      <!-- First header row: non-group columns and group headers -->
      <tr>
        {#each nonGroupColumns as col}
          {#if visibleColumns[col.id]}
            <th rowspan="2">{col.label}</th>
          {/if}
        {/each}
        {#each groups as group}
          {@const visibleCount = group.ids.filter(id => visibleColumns[id]).length}
          {#if visibleCount > 0}
            <th colspan={visibleCount} class="txt-center">{group.label}</th>
          {/if}
        {/each}
        {#if showAlternatives}
          <th rowspan="2" colspan="5" class="txt-center">Alternatives</th>
        {/if}
      </tr>
      <!-- Second header row: individual headers for grouped columns -->
      <tr>
        {#each groups as group}
          {#each group.ids as colId}
            {#if visibleColumns[colId]}
              <th>{colMap[colId].label}</th>
            {/if}
          {/each}
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each columns as col}
            {#if visibleColumns[col.id]}
              <td>{col.renderer(row)}</td>
            {/if}
          {/each}
          {#if showAlternatives}
            {#each row.alternatives as alt}
              <td>
                <span class="text-right" class:correct={alt.isCorrect}>
                  {alt.pct.toFixed(2)}%
                </span>
              </td>
            {/each}
            <td>
              <Button type="icon">🔍</Button>
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </Table>
</div>

<style>
  .correct {
    font-weight: bold;
  }
  th, td {
    white-space: nowrap;
    font-size: 0.8rem;
    padding: 0.5em;
    width: fit-content;
    text-align: left;
  }
  .txt-center{
    text-align: center !important;
  }
  .switch {
    display: flex;
    width: fit-content;
    gap: 0.3rem;
    font-weight: bold;
  }
  .switchs {
    display: grid;
    grid-template-columns: repeat(5, 0.2fr);
    margin-top: 0.6rem;
    gap: 0.3rem;
    width: 100%;
  }
  .red{}
  .green{}
</style>