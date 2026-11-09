<script setup lang="ts">
import TransferReceiptCrud from '../../cruds/TransferReceiptCrud'
import {Crud} from '@drax/crud-vue'
import {useI18n} from 'vue-i18n'

const {locale} = useI18n()
const formatDate = (value: string | Date | null, period = false) => value
  ? new Intl.DateTimeFormat(locale.value, period
    ? {month: '2-digit', year: 'numeric', timeZone: 'UTC'}
    : {day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'}).format(new Date(value))
  : ''
</script>

<template>
  <crud :entity="TransferReceiptCrud.instance">
    <template #item.billingPeriod="{value}">{{ formatDate(value, true) }}</template>
    <template #item.paymentDate="{value}">{{ formatDate(value) }}</template>
    <template #item.receipt="{value}">
      <v-btn v-if="value?.url" :href="value.url" target="_blank" rel="noopener noreferrer"
             variant="text" prepend-icon="mdi-file-document-outline">
        {{ value.filename }}
      </v-btn>
    </template>
    <template #item.syncedAt="{value}">{{ formatDate(value) }}</template>
  </crud>
</template>
