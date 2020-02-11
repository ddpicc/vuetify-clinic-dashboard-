<template>
  <material-card
    class="v-card--material-chart"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:header>
       <pie-chart :data="data" :colors="chartColor" height="150px"></pie-chart>
    </template>

    <slot />

    <slot
      slot="actions"
      name="actions"
    />
  </material-card>
</template>

<script>
  export default {
    name: 'MaterialPiechartCard',

    inheritAttrs: false,

    props: {
      data: {
        type: Object,
        default: () => ({})
      },
      chartColor: {
        type: Array,
        default: () => ({})
      }
    }
  }
</script>

<style lang="scss">
  .v-card--material-chart {
    .v-card--material__header {
      .ct-label {
        color: inherit;
        opacity: .7;
        font-size: 0.975rem;
        font-weight: 100;
      }

      .ct-grid{
        stroke: rgba(255, 255, 255, 0.2);
      }
      .ct-series-a .ct-point,
      .ct-series-a .ct-line,
      .ct-series-a .ct-bar,
      .ct-series-a .ct-slice-donut {
          stroke: rgba(255,255,255,.8);
      }
      .ct-series-a .ct-slice-pie,
      .ct-series-a .ct-area {
          fill: rgba(255,255,255,.4);
      }
    }
  }
</style>
