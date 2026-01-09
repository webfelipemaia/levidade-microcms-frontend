<template>
    <table class="table" :class="tableClass">
      <thead :class="headClass">
        <slot name="columns">
          <th v-for="column in columns" :key="column">{{ column }}</th>
        </slot>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <slot :row="item">
            <td v-for="(column, index) in columns" :key="index">
              {{ itemValue(item, column) }}
            </td>
          </slot>
        </tr>
      </tbody>
    </table>
  </template>
  <script setup>
  import { computed } from 'vue';
    
    const props = defineProps ({
      columns: Array,
      data: Array,
      type: {
        type: String,
        default: "default",
      },
      head: {
        type: String,
        default: "default",
      },
    })

    const headClass = computed(() => {
      return {
        default: '',
        light: 'table-light',
        dark: 'table-dark',
      }[props.head]
    })

    const tableClass = computed(() => {
      return {
        default: '',
        striped: 'table-striped',
        stripedColumns: 'table-striped-columns',
        hover: 'table-hover',
        stripedHover: 'table-striped table-hover',
      }[props.type]    
    })
    
    const itemValue = (item, column) => {
        return item[column.toLowerCase()];
    }

</script>
<style lang="scss">

    .table-light {
        color: #000;
        background-color: #f8f9fa;
        color: var(--bs-table-color);
        border-color: var(--bs-table-border-color);
        padding: 0.5rem;

        th {
            padding: 0.5rem;
        }
    }

    .table-dark {
        color: #fff;
        background-color: #212529;
        color: var(--bs-table-color);
        border-color: var(--bs-table-border-color);
        
        th {
            padding: 0.5rem;
        }
    }
    
</style>