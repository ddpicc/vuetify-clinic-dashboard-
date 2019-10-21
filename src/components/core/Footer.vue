<template>
  <v-footer
    id="core-footer"
    height="42"
  >
    
    <v-spacer />
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <a
        href="https://www.creative-tim.com/"
        target="_blank"
      >Creative Tim</a>, made with
      <v-icon
        color="tertiary"
        size="17"
      >mdi-heart</v-icon>
      for a better web
    </span>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      
    })
  }
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
