<script lang="ts">
  import { Table } from "@gzlab/uui";
  import type { PageInfo } from "../lib/store";

  export let pages: Record<number, PageInfo>;

  console.log(pages);

  // Flatten the data for table display
  $: rows = Object.values(pages).flatMap(page => 
    page.questions.map(question => ({
      page: page.page,
      instruction: page.instruction ? "Yes" : "No",
      duration_mean: page.duration.mean,
      duration_sd: page.duration.sd,
      itemRank: question.itemRank,
      testCode: question.testCode,
      diplome: question.diplome,
      nCandidates: question.nCandidates,
      correct_pct: question.correct_pct,
      incorrect_pct: question.incorrect_pct,
      empty_pct: question.empty_pct,
      not_seen_pct: question.not_seen_pct,
      answered_pct: question.answered_pct,
      difficulty: question.difficulty,
      discr_comp: question.discr_comp,
      discr_test: question.discr_test,
      d_index_comp: question.d_index_comp,
      d_index_test: question.d_index_test,
      alpha_drop_test: question.alpha_drop_test,
      alternatives: question.alternatives.map(alt => ({
        choiceId: alt.choiceId,
        text: alt.text,
        isCorrect: alt.isCorrect,
        pct: alt.pct
      }))
    }))
  );
</script>

<Table>
  <thead>
    <tr>
      <th>Page</th>
      <th>Instruction</th>
      <th>Duration Mean</th>
      <th>Duration SD</th>
      <th>Item Rank</th>
      <th>Test Code</th>
      <th>Diploma</th>
      <th>N Candidates</th>
      <th>Correct %</th>
      <th>Incorrect %</th>
      <th>Empty %</th>
      <th>Not Seen %</th>
      <th>Answered %</th>
      <th>Difficulty</th>
      <th>Discr Comp</th>
      <th>Discr Test</th>
      <th>D-Index Comp</th>
      <th>D-Index Test</th>
      <!-- <th>Alpha Drop</th> -->
      <th>Alternatives</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        <td>{row.page}</td>
        <td>{row.instruction}</td>
        <td>{row.duration_mean.toFixed(2)}s</td>
        <td>{row.duration_sd.toFixed(2)}s</td>
        <td>{row.itemRank}</td>
        <td>{row.testCode}</td>
        <td>{row.diplome}</td>
        <td>{row.nCandidates}</td>
        <td>{row.correct_pct.toFixed(2)}%</td>
        <td>{row.incorrect_pct.toFixed(2)}%</td>
        <td>{row.empty_pct.toFixed(2)}%</td>
        <td>{row.not_seen_pct.toFixed(2)}%</td>
        <td>{row.answered_pct.toFixed(2)}%</td>
        <td>{row.difficulty.toFixed(4)}</td>
        <td>{row.discr_comp.toFixed(4)}</td>
        <td>{row.discr_test.toFixed(4)}</td>
        <td>{row.d_index_comp.toFixed(4)}</td>
        <td>{row.d_index_test.toFixed(4)}</td>
        <!-- <td>{row.alpha_drop_test.toFixed(4)}</td> -->
        <td>
          <!-- <div class="space-y-1">
            {#each row.alternatives as alt}
              <div class="text-sm flex items-center gap-2">
                <span class="font-medium">{alt.choiceId}:</span>
                <span class="flex-1">{alt.text}</span>
                <span class="text-right">{alt.pct.toFixed(2)}%</span>
                {#if alt.isCorrect}
                  <span class="text-green-600">✓</span>
                {/if}
              </div>
            {/each}
          </div> -->
        </td>
      </tr>
    {/each}
  </tbody>
</Table> 