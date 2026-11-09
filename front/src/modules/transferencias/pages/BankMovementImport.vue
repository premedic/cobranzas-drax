<script setup lang="ts">
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {MediaFullField} from "@drax/media-vue";
import BankMovementProvider, {
  type BankMovementImportBank,
  type BankMovementImportFile,
  type BankMovementImportResult
} from "../providers/BankMovementProvider";

const {t} = useI18n();
const bank = ref<BankMovementImportBank | null>(null);
const fileInput = ref<BankMovementImportFile>({});
const loading = ref(false);
const errorMessage = ref("");
const lastResult = ref<BankMovementImportResult | null>(null);

const banks: Array<{title: string; value: BankMovementImportBank}> = [
  {title: "Banco Credicoop", value: "credicoop"}
];
const canImport = computed(() => Boolean(bank.value && fileInput.value.filepath) && !loading.value);

async function importMovements() {
  if (!bank.value || !fileInput.value.filepath) return;

  loading.value = true;
  errorMessage.value = "";
  lastResult.value = null;

  try {
    lastResult.value = await BankMovementProvider.instance.importFile(bank.value, fileInput.value);
    fileInput.value = {};
  } catch (error: any) {
    errorMessage.value = error?.message || t("bankmovement.import.error");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="8" xl="6">
        <v-card variant="flat" border>
          <v-card-title class="d-flex align-center ga-2">
            <v-icon icon="mdi-bank-plus" />
            <span>{{ t("bankmovement.import.title") }}</span>
          </v-card-title>

          <v-card-text>
            <v-alert
              class="mb-4"
              type="info"
              variant="tonal"
              density="comfortable"
              :text="t('bankmovement.import.description')"
            />

            <v-autocomplete
              v-model="bank"
              class="mb-4"
              :items="banks"
              :label="t('bankmovement.import.bank')"
              :readonly="loading"
              item-title="title"
              item-value="value"
              prepend-inner-icon="mdi-bank"
              variant="outlined"
              hide-details
            />

            <media-full-field
              v-model="fileInput"
              dir="bank-movement-imports"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :label="t('bankmovement.import.file')"
              :readonly="loading"
              prepend-icon=""
              prepend-inner-icon="mdi-file-excel-outline"
              variant="outlined"
              clearable
              :timeout="600000"
            />

            <v-alert
              v-if="errorMessage"
              class="mt-4"
              type="error"
              variant="tonal"
              density="comfortable"
              :text="errorMessage"
            />

            <v-alert
              v-if="lastResult"
              class="mt-4"
              type="success"
              variant="tonal"
              density="comfortable"
            >
              {{ t("bankmovement.import.success", {count: lastResult.rowCount}) }}
            </v-alert>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn
              color="primary"
              variant="flat"
              :loading="loading"
              :disabled="!canImport"
              prepend-icon="mdi-upload"
              @click="importMovements"
            >
              {{ t("bankmovement.import.submit") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
