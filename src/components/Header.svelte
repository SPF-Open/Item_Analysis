<script>
  import { Card, ComboBox, ComboBoxElement } from "@gzlab/uui";

  import { file } from "../lib/store";
  import FileInput from "../FileInput.svelte";
  import { locale, locales } from "../lib/i18n";
</script>

<div class="hide-print">
  <Card>
    <div class="hide-print flex-h">
      <FileInput
        label="Upload File"
        bind:file={$file}
        name="file"
        accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
      />
      <ComboBox disabled>
        <div slot="selected">
          {$locale.toUpperCase()}
        </div>
        <div slot="list" class="langList">
          {#each locales as loc}
            <ComboBoxElement value={loc} bind:selection={$locale}>
              {loc.toUpperCase()}
            </ComboBoxElement>
          {/each}
        </div>
      </ComboBox>
    </div>
  </Card>
</div>
