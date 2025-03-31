<script lang="ts">
  import { Card } from "@gzlab/uui";
  import type { PageInfo } from "../lib/store";
  import Question from "./Question.svelte";

  export let page: PageInfo;
</script>

<Card>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Page {page.page}</h2>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p class="font-semibold">Instruction</p>
        <p>{page.instruction ? "Yes" : "No"}</p>
      </div>
      <div>
        
        <p class="font-semibold">Duration Mean</p>
        <p>{page.duration.mean} seconds</p>
      </div>
      <div>
        <p class="font-semibold">Duration Standard Deviation</p>
        <p>{page.duration.sd} seconds</p>
      </div>
      <div>
        <p class="font-semibold">Duration Q10</p>
        <p>{page.duration.q10} seconds</p>
      </div>
      <div>
        <p class="font-semibold">Duration Q25</p>
        <p>{page.duration.q25} seconds</p>
      </div>
      <div>
        <p class="font-semibold">Duration Q50 (Median)</p>
        <p>{page.duration.q50} seconds</p>
      </div>
      <div>
        <p class="font-semibold">Duration Q75</p>
        <p>{page.duration.q75} seconds</p>
      </div>
      <div>
        <p class="font-semibold">Duration Q90</p>
        <p>{page.duration.q90} seconds</p>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-4">Questions</h3>
      <div class="space-y-6">
        {#each page.questions as question}
          <Question {question} />
        {/each}
      </div>
    </div>
  </div>
</Card> 