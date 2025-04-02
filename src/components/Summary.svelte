<script>
  import { Card } from "@gzlab/uui";
  import { testInfo } from "../lib/store";
</script>

{#if $testInfo}
  <div class="flex-h hide-print">
    <div class="flex-h">
      {#each $testInfo as info}
        <Card size="md">
          <span slot="title">{info.name}</span>
          <div class="flex-h">
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
  </div>
{/if}

<style>
</style>
