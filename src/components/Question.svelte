<script lang="ts">
  import { Card } from "@gzlab/uui";
  import type { Question } from "../lib/store";
  import Alternative from "./Alternative.svelte";

  export let question: Question;
</script>

<Card>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-4">Question {question.itemRank}</h3>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p class="font-semibold">Test Code</p>
        <p>{question.testCode}</p>
      </div>
      <div>
        <p class="font-semibold">Diploma</p>
        <p>{question.diplome}</p>
      </div>
      <div>
        <p class="font-semibold">Number of Candidates</p>
        <p>{question.nCandidates}</p>
      </div>
      <div>
        <p class="font-semibold">Number of Procedures</p>
        <p>{question.nProcedures}</p>
      </div>
      <div>
        <p class="font-semibold">Correct Percentage</p>
        <p>{question.correct_pct}%</p>
      </div>
      <div>
        <p class="font-semibold">Incorrect Percentage</p>
        <p>{question.incorrect_pct}%</p>
      </div>
      <div>
        <p class="font-semibold">Empty Percentage</p>
        <p>{question.empty_pct}%</p>
      </div>
      <div>
        <p class="font-semibold">Not Seen Percentage</p>
        <p>{question.not_seen_pct}%</p>
      </div>
      <div>
        <p class="font-semibold">Answered Percentage</p>
        <p>{question.answered_pct}%</p>
      </div>
      <div>
        <p class="font-semibold">Difficulty</p>
        <p>{question.difficulty}</p>
      </div>
      <div>
        <p class="font-semibold">Discrimination (Comp)</p>
        <p>{question.discr_comp}</p>
      </div>
      <div>
        <p class="font-semibold">Discrimination (Test)</p>
        <p>{question.discr_test}</p>
      </div>
      <div>
        <p class="font-semibold">D-Index (Comp)</p>
        <p>{question.d_index_comp}</p>
      </div>
      <div>
        <p class="font-semibold">D-Index (Test)</p>
        <p>{question.d_index_test}</p>
      </div>
      <div>
        <p class="font-semibold">Alpha Drop Test</p>
        <p>{question.alpha_drop_test}</p>
      </div>
    </div>

    <div class="mt-6">
      <h4 class="text-md font-semibold mb-4">Alternatives</h4>
      <div class="space-y-4">
        {#each question.alternatives as alternative}
          <Alternative {alternative} />
        {/each}
      </div>
    </div>
  </div>
</Card> 