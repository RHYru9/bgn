<script setup lang="ts">
import { ref } from 'vue';

const dialog = ref(false);
const dialog2 = ref(false);
const dialog3 = ref(false);
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Nested -->
  <!-- ----------------------------------------------------------------------------- -->
  <p class="text-caption text-grey-darken-1">Dialogs can be nested: you can open one dialog from another.</p>
  <div class="text-center">
    <v-btn color="primary" variant="flat" class="ma-2" @click="(dialog = true)"> Open Dialog 1 </v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title> Dialog 1 </v-card-title>
        <v-card-text>
          <v-btn color="primary" variant="flat" class="ma-2" @click="(dialog2 = true)"> Open Dialog 2 </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="text" @click="(dialog = false)"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2">
      <v-card>
        <v-card-title> Dialog 2 </v-card-title>
        <v-card-text>
          <v-btn color="secondary" variant="flat" @click="(dialog3 = !dialog3)"> Open Dialog 3 </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="text" @click="(dialog2 = false)"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog3">
      <v-card>
        <v-card-title>
          <span>Dialog 3</span>
        </v-card-title>
        <v-card-actions>
          <v-btn color="error" variant="text" @click="(dialog3 = false)"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
