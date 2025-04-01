<script lang="ts">
  import { Button, Card, Switch, Table, ToolTip } from "@gzlab/uui";
  import type { PageInfo } from "../lib/store";
  import { visibleColumns, colorRules } from "./DynamicTable";

  export let pagesData: Record<number, PageInfo>;

  // Define the structure of a column (excluding alternatives)
  type Column = {
    id: string;
    label: string;
    tooltip?: string;
    renderer: (row: any) => string;
  };

  // Configure your columns here (the renderer formats the cell value)
  let columns: Column[] = [
    { id: "page", label: "Page", renderer: (row) => row.page },
    { id: "itemRank", label: "Item", renderer: (row) => row.itemRank},
    {
      id: "instruction",
      label: "Instruction",
      renderer: (row) => row.instruction,
    },
    {
      id: "duration_mean",
      label: "Mean",
      renderer: (row) => row.duration_mean.toFixed(2) + "s",
    },
    {
      id: "duration_sd",
      label: "SD",
      renderer: (row) => row.duration_sd.toFixed(2) + "s",
    },
    { id: "testCode", label: "Test Code", renderer: (row) => row.testCode },
    { id: "diplome", label: "Diploma", renderer: (row) => row.diplome },
    {
      id: "nCandidates",
      label: "Total",
      renderer: (row) => row.nCandidates,
    },
    {
      id: "correct_pct",
      label: "Correct %",
      renderer: (row) => row.correct_pct.toFixed(2) + "%",
    },
    {
      id: "incorrect_pct",
      label: "Incorrect %",
      renderer: (row) => row.incorrect_pct.toFixed(2) + "%",
    },
    {
      id: "empty_pct",
      label: "Empty %",
      renderer: (row) => row.empty_pct.toFixed(2) + "%",
    },
    {
      id: "not_seen_pct",
      label: "Not Seen %",
      renderer: (row) => row.not_seen_pct.toFixed(2) + "%",
    },
    {
      id: "answered_pct",
      label: "Answered %",
      renderer: (row) => row.answered_pct.toFixed(2) + "%",
    },
    {
      id: "difficulty",
      label: "Difficulty",
      renderer: (row) => row.difficulty.toFixed(4),
    },
    {
      id: "discr_comp",
      label: "Discr Comp",
      renderer: (row) => row.discr_comp.toFixed(4),
    },
    {
      id: "discr_test",
      label: "Discr Test",
      renderer: (row) => row.discr_test.toFixed(4),
    },
    {
      id: "d_index_comp",
      label: "D-Index Comp",
      renderer: (row) => row.d_index_comp.toFixed(4),
    },
    {
      id: "d_index_test",
      label: "D-Index Test",
      renderer: (row) => row.d_index_test.toFixed(4),
    },
  ];

  // Toggle for the alternatives column(s)
  let showAlternatives = true;

  // Control to show or hide the column toggle menu
  let showToggleMenu = false;

  // Define groups with associated column IDs
  const groups = [
    { label: "Duration", ids: ["duration_mean", "duration_sd"] },
    { label: "Candidats", ids: ["diplome", "nCandidates"] },
    { label: "Difficulté", ids: ["correct_pct", "incorrect_pct"] },
    {
      label: "Abstentions",
      ids: ["empty_pct", "not_seen_pct", "answered_pct"],
    },
    {
      label: "Indices",
      ids: [
        "difficulty",
        "discr_comp",
        "discr_test",
        "d_index_comp",
        "d_index_test",
      ],
    },
  ];

  // Create a set of all grouped column IDs
  const groupedIds = new Set(groups.flatMap((group) => group.ids));

  // Non-grouped columns are those not part of any group
  const nonGroupColumns = columns.filter((col) => !groupedIds.has(col.id));

  // Mapping from column id to column object
  let colMap: Record<string, Column> = {};
  columns.forEach((col) => {
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

  // Helper function to determine if a column is the last visible in its group
  function getGroupBorderClass(colId: string): string {
    for (const group of groups) {
      if (group.ids.includes(colId)) {
        const visibleGroupCols = group.ids.filter((id) => visibleColumns[id]);
        if (
          visibleGroupCols.length &&
          visibleGroupCols[visibleGroupCols.length - 1] === colId
        ) {
          return "group-border";
        }
        return "";
      }
    }
    return "group-border";
  }

  // Helper function to apply color rules if defined and cell value is numeric.
  function getColorClass(colId: string, cellValue: any): string {
    const rule = colorRules[colId];
    if (rule && typeof cellValue === "number") {
      if (cellValue < rule.max && cellValue > rule.min) return rule.inClass;
      if (cellValue < rule.min) return rule.belowClass;
      if (cellValue > rule.max) return rule.aboveClass;
      return "";
    }
    return "";
  }

  // Helper function for alternatives heat map styling.
  function getAltHeatClass(alt: { pct: number; isCorrect: boolean }): string {
    const ideal = alt.isCorrect ? 34 : 22;
    const diff = Math.abs(alt.pct - ideal);
    if (diff < 3) return "heat-low";
    if (diff < 7) return "heat-medium";
    return "heat-high";
  }
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
            <th rowspan="2" class="group-border"
              >{col.label}
              {#if col.tooltip}
                <ToolTip>{col.tooltip}</ToolTip>
              {/if}
            </th>
          {/if}
        {/each}
        {#each groups as group}
          {@const visibleCount = group.ids.filter(
            (id) => visibleColumns[id]
          ).length}
          {#if visibleCount > 0}
            <th colspan={visibleCount} class="txt-center group-header"
              >{group.label}</th
            >
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
              <th class={getGroupBorderClass(colId)}>
                {colMap[colId].label}
                {#if colMap[colId].tooltip}
                  <ToolTip>{colMap[colId].tooltip}</ToolTip>
                {/if}
              </th>
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
              <td
                class="{getColorClass(
                  col.id,
                  row[col.id]
                )} {getGroupBorderClass(col.id)}"
              >
                {col.renderer(row)}
              </td>
            {/if}
          {/each}
          {#if showAlternatives}
            {#each row.alternatives as alt}
              <td
                class={getAltHeatClass(alt)}
                style="width: {alt.isCorrect ? '34%' : '22%'}"
              >
                <span class="text-right" class:correct={alt.isCorrect}>
                  {alt.pct.toFixed(2)}%
                </span>
              </td>
            {/each}
            <td class="hide-print">
              <Button type="icon">🔍</Button>
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </Table>
</div>

<style>
  .red {
    background-color: #fdd;
  }
  .orange {
    background-color: #ffd;
  }
  .green {
    background-color: #dfd;
  }
  .correct {
    font-weight: bold;
  }
  th,
  td {
    white-space: nowrap;
    font-size: 0.8rem;
    padding: 0.5em;
    width: fit-content;
    text-align: left;
    border: 1px solid #ccccccac;
  }
  .txt-center {
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
  /* Heat map styles for alternatives */
  .heat-low {
    background-color: #dff0d8; /* light green */
  }
  .heat-medium {
    background-color: #fcf8e3; /* light yellow */
  }
  .heat-high {
    background-color: #f2dede; /* light red */
  }
  .group-header,
  .group-border {
    border-right: 2px solid #ccc;
  }
  /* Ensure table cells join their borders */
  .table > :global(table) {
    border-collapse: collapse;
  }
</style>
