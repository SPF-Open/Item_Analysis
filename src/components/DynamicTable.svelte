<script lang="ts">
  import {
    Button,
    Card,
    ComboBox,
    ComboBoxElement,
    LongText,
    Modal,
    Numeric,
    Switch,
    Table,
    ToolTip,
  } from "@gzlab/uui";
  import type { PageInfo } from "../lib/store";
  import { visibleColumns, colorRules } from "./DynamicTable";
  import { read, utils, write } from "xlsx";
  import { file } from "../lib/store";
  import { onMount } from "svelte";

  let { pagesData }: { pagesData: Record<number, PageInfo> } = $props();

  // Define the structure of a column (excluding alternatives)
  type Column = {
    id: string;
    label: string;
    tooltip?: string;
    renderer: (row: any) => string;
  };

  // Configure your columns here (the renderer formats the cell value)
  let columns: Column[] = [
    { id: "page", label: "Page", renderer: (row) => row.page || "" },
    { id: "itemRank", label: "Item", renderer: (row) => row.itemRank || "" },
    {
      id: "instruction",
      label: "Instruction",
      renderer: (row) => row.instruction || "",
    },
    {
      id: "duration_mean",
      label: "Mean",
      renderer: (row) => {
        try {
          return row.duration_mean.toFixed(2) + "s";
        } catch {
          return "";
        }
      },
    },
    {
      id: "duration_sd",
      label: "SD",
      renderer: (row) => {
        try {
          return row.duration_sd.toFixed(2) + "s";
        } catch {
          return "";
        }
      },
    },
    {
      id: "testCode",
      label: "Test Code",
      renderer: (row) => row.testCode || "",
    },
    { id: "diplome", label: "Diploma", renderer: (row) => row.diplome || "" },
    {
      id: "nCandidates",
      label: "Total",
      renderer: (row) => row.nCandidates || "",
    },
    {
      id: "correct_pct",
      label: "Correct %",
      renderer: (row) => {
        try {
          return row.correct_pct.toFixed(2) + "%";
        } catch {
          return "";
        }
      },
    },
    {
      id: "incorrect_pct",
      label: "Incorrect %",
      renderer: (row) => {
        try {
          return row.incorrect_pct.toFixed(2) + "%";
        } catch {
          return "";
        }
      },
    },
    {
      id: "empty_pct",
      label: "Empty %",
      renderer: (row) => {
        try {
          return row.empty_pct.toFixed(2) + "%";
        } catch {
          return "";
        }
      },
    },
    {
      id: "not_seen_pct",
      label: "Not Seen %",
      renderer: (row) => {
        try {
          return row.not_seen_pct.toFixed(2) + "%";
        } catch {
          return "";
        }
      },
    },
    {
      id: "answered_pct",
      label: "Answered %",
      renderer: (row) => {
        try {
          return row.answered_pct.toFixed(2) + "%";
        } catch {
          return "";
        }
      },
    },
    {
      id: "difficulty",
      label: "Difficulty",
      renderer: (row) => {
        try {
          return row.difficulty.toFixed(4);
        } catch {
          return "";
        }
      },
    },
    {
      id: "discr_comp",
      label: "Discr Comp",
      renderer: (row) => {
        try {
          return row.discr_comp.toFixed(4);
        } catch {
          return "";
        }
      },
    },
    {
      id: "discr_test",
      label: "Discr Test",
      renderer: (row) => {
        try {
          return row.discr_test.toFixed(4);
        } catch {
          return "";
        }
      },
    },
    {
      id: "d_index_comp",
      label: "D-Index Comp",
      renderer: (row) => {
        try {
          return row.d_index_comp.toFixed(4);
        } catch {
          return "";
        }
      },
    },
    {
      id: "d_index_test",
      label: "D-Index Test",
      renderer: (row) => {
        try {
          return row.d_index_test.toFixed(4);
        } catch {
          return "";
        }
      },
    },
  ];

  // Toggle for the alternatives column(s)
  let showAlternatives = $state(true);

  // Control to show or hide the column toggle menu
  let showToggleMenu = $state(false);

  // Define groups with associated column IDs
  const groups = [
    { label: "Duration", ids: ["duration_mean", "duration_sd"] },
    { label: "Candidats", ids: ["diplome", "nCandidates"] },
    { label: "Difficulty", ids: ["correct_pct", "incorrect_pct"] },
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

  let rows = $state<any | null>(null);

  // Flatten page data for table display
  onMount(() => {
    rows = Object.values(pagesData).flatMap((page) =>
      page.questions.map((question) => ({
        ...question,
        // Ensure to add page-level data so the renderer functions work
        page: page.page ?? "",
        instruction: page.instruction,
        duration_mean: page.duration.mean,
        duration_sd: page.duration.sd,
      }))
    );
  });

  // Helper function to determine if a column is the last visible in its group
  function getGroupBorderClass(colId: string): string {
    for (const group of groups) {
      if (group.ids.includes(colId)) {
        const visibleGroupCols = group.ids.filter((id) => $visibleColumns[id]);
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
      if (cellValue < rule.max && cellValue >= rule.min) return rule.inClass;
      if (cellValue < rule.min) return rule.belowClass;
      if (cellValue > rule.max) return rule.aboveClass;
      return "";
    }
    return "";
  }

  // Configurable thresholds for alternative heat mapping
  let altThresholdHigh: number = $state(10);
  let altThresholdMedium: number = $state(5);
  let altThresholdLow: number = $state(10);

  // Refactored heat map function for alternatives with configurable thresholds
  function getAltHeatClass(
    row: any,
    alt: { pct: number; isCorrect: boolean }
  ): string {
    const correctAlt = row.alternatives.find((a: any) => a.isCorrect);
    const correctPct = correctAlt ? correctAlt.pct : 0;
    if (!alt.isCorrect) {
      const diff = alt.pct - correctPct;
      if (diff > altThresholdHigh) return "heat-high"; // significantly more chosen → red
      if (diff > altThresholdMedium) return "heat-medium"; // moderately more chosen → orange
      if (alt.pct < altThresholdLow) return "heat-cold"; // almost never chosen → "cold" (blue)
    }
    return "";
  }

  let showModal = $state(false);
  let selectedRow: any = $state(null);

  function openModal(row: any) {
    selectedRow = row;
    showModal = true;
  }

  // New export function to add a new sheet with table rows to the original workbook
  async function exportToExcel() {
    if (!$file) {
      alert("No original file available for export.");
      return;
    }
    const arrayBuffer = await $file.arrayBuffer();
    const workbook = read(arrayBuffer, { type: "array" });

    // Create a new sheet from table rows
    const newSheet = utils.json_to_sheet(rows);
    const sheetName = "Analysis";
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = newSheet;

    const wbout = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="hide-print">
  <Card>
    <div slot="title" class="flex-h">
      <Button onClick={() => (showToggleMenu = !showToggleMenu)} type="info">
        {#if showToggleMenu}Hide Column Menu{:else}Show Column Menu{/if}
      </Button>
      <!-- New Export Button -->
      <div class="flex-h">
        <label>
          <span> High </span>
          <ToolTip><div class="tooltip">Diff high</div></ToolTip>
        </label>
        <Numeric bind:value={altThresholdHigh} />
      </div>
      <div class="flex-h">
        <label>
          <span> Medium </span>
          <ToolTip><div class="tooltip">Diff low</div></ToolTip>
        </label>
        <Numeric bind:value={altThresholdMedium} />
      </div>
      <div class="flex-h">
        <label>
          <span> Low </span>
          <ToolTip><div class="tooltip">Low value in %</div></ToolTip>
        </label>
        <Numeric bind:value={altThresholdLow} />
      </div>

      <Button onClick={exportToExcel} type="success">Export Table</Button>
    </div>
    {#if showToggleMenu}
      <div>
        <h3>Toggle Columns</h3>
        <div class="switchs">
          {#each Object.keys($visibleColumns) as colId}
            <label class="switch">
              <Switch bind:checked={$visibleColumns[colId]} />
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

<div class="table">
  <Table>
    <thead>
      <!-- First header row: non-group columns and group headers -->
      <tr>
        {#each nonGroupColumns as col}
          {#if $visibleColumns[col.id]}
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
            (id) => $visibleColumns[id]
          ).length}
          {#if visibleCount > 0}
            <th colspan={visibleCount} class="txt-center group-header"
              >{group.label}</th
            >
          {/if}
        {/each}
        {#if showAlternatives}
          <th rowspan="1" colspan="4" class="txt-center">Alternatives</th>
        {/if}
        <th rowspan="2" class="hide-print"></th>
      </tr>
      <!-- Second header row: individual headers for grouped columns -->
      <tr>
        {#each groups as group}
          {#each group.ids as colId}
            {#if $visibleColumns[colId]}
              <th class={getGroupBorderClass(colId)}>
                {colMap[colId].label}
                {#if colMap[colId].tooltip}
                  <ToolTip>{colMap[colId].tooltip}</ToolTip>
                {/if}
              </th>
            {/if}
          {/each}
        {/each}
        {#if showAlternatives}
          <th class="txt-center"> Correct </th>
          <th class="txt-center">B</th>
          <th class="txt-center">C</th>
          <th class="txt-center">D</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each columns as col}
            {#if $visibleColumns[col.id]}
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
                class={getAltHeatClass(row, alt)}
                style="width: {alt.isCorrect ? '34%' : '22%'}"
              >
                <span class="text-right" class:correct={alt.isCorrect}>
                  {alt.pct.toFixed(2)}%
                </span>
              </td>
            {/each}
            <td class="hide-print">
              <Button type="icon" onClick={() => openModal(row)}>🔍</Button>
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </Table>
</div>

{#if showModal}
  <div class="modal">
    <Modal bind:state={showModal} size="">
      <svelte:fragment slot="title">
        <h3>Details for item : {selectedRow.itemRank}</h3>
      </svelte:fragment>
      <div class="modal-content">
        <!-- Display detailed row info -->
        {#if selectedRow}
          <div>
            <div class="flex-h">
              {#each selectedRow.alternatives as alt, index}
                <Card size="lg" status={alt.isCorrect ? "success" : undefined}>
                  <div slot="title" class="title">
                    <span>
                      Alternative {index + 1}
                    </span>
                    <span>
                      {alt.pct.toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    {alt.text}
                  </div>
                </Card>
              {/each}
            </div>
          </div>
        {/if}
        <!-- Additional alternatives info and actions -->
      </div>
      <div class="modal-actions" slot="footer">
        <LongText
          disabled
          cols={190}
          rows={4}
          placeholder="Additional info"
          bind:value={selectedRow.extraInfo}
        />
        <div class="flex-h">
          <ComboBox disabled>
            <div slot="selected">
              {selectedRow.action || "Choisir une action"}
            </div>
            <div slot="list">
              <ComboBoxElement
                value="archive"
                bind:selection={selectedRow.action}>Archiver</ComboBoxElement
              >
              <ComboBoxElement
                value="change"
                bind:selection={selectedRow.action}
                >Modifier la bonne réponse</ComboBoxElement
              >
              <ComboBoxElement
                value="delete"
                bind:selection={selectedRow.action}>Supprimer</ComboBoxElement
              >
              <ComboBoxElement value="other" bind:selection={selectedRow.action}
                >Autre</ComboBoxElement
              >
            </div>
          </ComboBox>
          <Button type="danger" onClick={() => (showModal = false)}
            >Cancel</Button
          >
          <Button type="success" disabled>Save</Button>
        </div>
      </div>
    </Modal>
  </div>
{/if}

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
  td {
    text-align: right;
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
  .heat-cold {
    background-color: #cce5ff; /* light blue for nearly unchosen alternatives */
  }
  .group-header,
  .group-border {
    border-right: 2px solid #ccc;
  }
  /* Ensure table cells join their borders */
  .table > :global(table) {
    border-collapse: collapse;
  }
  .modal :global(.modal){
    width: min(85vw, 1400px);
  }
  .modal-content {
    padding: 1rem;
    max-height: 62vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .modal-actions {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .modal-content .title {
    display: flex;
    justify-content: space-between;
  }
  .tooltip {
    width: 120px;
  }
</style>
