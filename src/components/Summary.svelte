<script>
  import { Card } from "@gzlab/uui";
  import { pagesData } from "../lib/store";
</script>

<Card>
  <div class="title" slot="title">Summary</div>
  <div class="flex">
    <Card size="md">
      <div class="title" slot="title">Test</div>
      <div class="body">
        <span>
        </span>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit possimus,
        facilis praesentium labore quasi perferendis vero velit quam corporis
        ipsum laborum facere fugit recusandae? Voluptates pariatur nostrum
        eveniet molestias reiciendis?
      </div>
    </Card>
    <Card size="md">
      <div class="title" slot="title">Item</div>
      <div class="body">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit possimus,
        facilis praesentium labore quasi perferendis vero velit quam corporis
        ipsum laborum facere fugit recusandae? Voluptates pariatur nostrum
        eveniet molestias reiciendis?
      </div>
    </Card>
    <Card size="md">
      <div class="title" slot="title">Candidats</div>
      <div class="body">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit possimus,
        facilis praesentium labore quasi perferendis vero velit quam corporis
        ipsum laborum facere fugit recusandae? Voluptates pariatur nostrum
        eveniet molestias reiciendis?
      </div>
    </Card>
    <Card size="md">
      <div class="title" slot="title">Réponse</div>
      <div class="body">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit possimus,
        facilis praesentium labore quasi perferendis vero velit quam corporis
        ipsum laborum facere fugit recusandae? Voluptates pariatur nostrum
        eveniet molestias reiciendis?
      </div>
    </Card>
    <Card size="md">
      <div class="title" slot="title">Difficulté + discrimination</div>
      <div class="body">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit possimus,
        facilis praesentium labore quasi perferendis vero velit quam corporis
        ipsum laborum facere fugit recusandae? Voluptates pariatur nostrum
        eveniet molestias reiciendis?
      </div>
    </Card>
    <Card size="md">
      <div class="title" slot="title">Alternatives</div>
      <div class="body">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit possimus,
        facilis praesentium labore quasi perferendis vero velit quam corporis
        ipsum laborum facere fugit recusandae? Voluptates pariatur nostrum
        eveniet molestias reiciendis?
      </div>
    </Card>
  </div>
</Card>

<style>
  .flex {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }
</style>
