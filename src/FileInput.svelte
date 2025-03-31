<script lang="ts">
  import { Button, Card } from "@gzlab/uui";

  let {
    file = $bindable<File | null>(null),
    name,
    id = Math.random().toString(36).substring(2, 15),
    accept,
  } = $props<{
    label?: string;
    file: File | null;
    name?: string;
    id?: string;
    accept?: string;
  }>();

  const onChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      file = files[0];
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      file = droppedFiles[0];
    }
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
</script>

<div
  class="file-input"
  role="region"
  ondrop={onDrop}
  ondragover={onDragOver}
  ondragenter={onDragEnter}
>
  <Card>
    <div class="cont">
      <!-- <p>{file?.name || "No file selected"}</p> -->
      {#if file}
        <p>{file.name}</p>
        <Button type="danger" onClick={() => (file = null)}>Clear</Button>
      {:else}
        <p>Drop the file in the box</p>
        <p>or</p>
        <Button type="info"><label for={id}>Browse file</label></Button>
      {/if}
    </div>
  </Card>
</div>
<input
  type="file"
  {id}
  {name}
  {accept}
  bind:files={file}
  onchange={onChange}
  hidden
/>

<style>
  .file-input {
    width: fit-content;
  }
  .cont {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.6rem;
    font-size: 1rem;
  }
  .cont label {
    white-space: nowrap;
    cursor: pointer;
  }
  .cont p {
    margin: 0;
    font-size: 0.9rem;
  }
</style>
