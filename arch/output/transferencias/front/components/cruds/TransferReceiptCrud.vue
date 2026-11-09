
<script setup lang="ts">
import TransferReceiptCrud from '../../cruds/TransferReceiptCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="TransferReceiptCrud.instance">
    <template v-slot:item.billingPeriod="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.paymentDate="{value}">{{formatDate(value)}}</template>
    <template v-slot:item.receipt="{value}"><v-img :src="value?.url" max-height="30px" class="my-1" /></template>
    <template v-slot:item.syncedAt="{value}">{{formatDate(value)}}</template>
  </crud>
</template>

<style scoped>

</style>

