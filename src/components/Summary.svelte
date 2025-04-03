<script>
  import { Card } from "@gzlab/uui";
  import { pagesData, testInfo } from "../lib/store";

  // Helper for alternative minimap heat colors (matching DynamicTable)
  function getAlternativeMinimapClass(alt) {
    if (!alt || typeof alt.pct !== "number") return "";
    if (alt.pct < 25) return "heat-minimap-low";
    if (alt.pct < 50) return "heat-minimap-medium";
    return "heat-minimap-high";
  }

  // Compute rows from pagesData for questions (like in DynamicTable)
  $: rows = Object.values($pagesData).flatMap((page) =>
    page.questions.map((question) => ({
      ...question,
      // add page level info for consistency
      page: page.page ?? "",
      instruction: page.instruction,
      duration_mean: page.duration?.mean,
      duration_sd: page.duration?.sd,
    }))
  );
</script>

<div class="flex-h">
  {#if $testInfo}
    <div class="flex-h">
      {#each $testInfo as info}
        <Card size="md">
          <span slot="title">{info.name}</span>
          <div class="flex-h tests">
            {#each info.diplome as diplome}
              <Card>
                <span slot="title">{diplome.name}</span>
                <p>Question : {diplome.questionNb}</p>
                <p>Candidate : {diplome.candidateNb}</p>
              </Card>
            {/each}
          </div>
        </Card>
      {/each}
    </div>
  {/if}

  <Card size="lg">
    <span slot="title">Questions Overview</span>
    <p>Total Questions: {rows.length}</p>
    <!-- Alternative Heat Minimap using rows data -->
    <div class="alt-minimap">
      <h4>Alternatives Heat Minimap</h4>
      {#each [0, 1, 2, 3] as altIndex}
        <div class="alt-minimap-row">
          {#each rows as row}
            {#if row.alternatives && row.alternatives[altIndex]}
              <div
                class="alt-minimap-square {getAlternativeMinimapClass(
                  row.alternatives[altIndex]
                )}"
              ></div>
            {:else}
              <div class="alt-minimap-square"></div>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </Card>
</div>

<style>
  .minimap {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    margin-top: 0.5rem;
  }
  .minimap-square {
    width: 10px;
    height: 10px;
    background-color: #eee;
  }

  /* Alternative Heat Minimap Styles */
  .alt-minimap {
    margin-top: 0.5rem;
  }
  .alt-minimap-row {
    display: flex;
    gap: 2px;
    margin-bottom: 2px;
  }
  .alt-minimap-square {
    width: 8px;
    height: 8px;
    background-color: #eee;
  }
  .heat-minimap-low {
    background-color: #dff0d8; /* light green */
  }
  .heat-minimap-medium {
    background-color: #fcf8e3; /* light yellow */
  }
  .heat-minimap-high {
    background-color: #f2dede; /* light red */
  }
  .tests > :global(*){
    flex: 1;
  }
</style>
