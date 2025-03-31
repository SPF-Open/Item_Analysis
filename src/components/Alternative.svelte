<script lang="ts">
  import { Card } from "@gzlab/uui";
  import type { Alternative } from "../lib/store";

  export let alternative: Alternative;
</script>

<Card>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-4">Alternative {alternative.choiceId}</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="font-semibold">Text</p>
        <p>{alternative.text}</p>
      </div>
      <div>
        <p class="font-semibold">Correct</p>
        <p>{alternative.isCorrect ? "Yes" : "No"}</p>
      </div>
      <div>
        <p class="font-semibold">Percentage</p>
        <p>{alternative.pct}%</p>
      </div>
      <div>
        <p class="font-semibold">Number of Answers</p>
        <p>{alternative.nAnswers} / {alternative.total}</p>
      </div>
      <div>
        <p class="font-semibold">Discrimination Index (Comp)</p>
        <p>{alternative.d_index_comp}</p>
      </div>
      <div>
        <p class="font-semibold">Discrimination Index (Test)</p>
        <p>{alternative.d_index_test}</p>
      </div>
    </div>
  </div>
</Card> 