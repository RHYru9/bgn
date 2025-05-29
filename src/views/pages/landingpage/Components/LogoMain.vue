<template>
  <div class="logo">
    <RouterLink to="/" aria-label="logo">
      <svg
        width="120"
        height="70"
        viewBox="0 0 220 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Background Transparent -->
        <rect width="220" height="70" fill="transparent" />

        <!-- Motion Lines -->
        <path
          d="M10 35H25"
          stroke="#D97706"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M10 26H40"
          stroke="#D97706"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M10 44H39"
          stroke="#D97706"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Lingkaran besar lebih membulat dan menyatu -->
        <circle
          cx="67"
          cy="38"
          r="30"
          stroke="#D97706"
          stroke-width="6"
          fill="none"
          stroke-dasharray="300 60"
          stroke-dashoffset="330"
        />

        <!-- Badan Truk (lebih membulat) -->
        <rect
          x="45"
          y="34"
          width="30"
          height="14"
          rx="3"
          ry="3"
          fill="#D97706"
        />

        <!-- Kepala Truk dengan bentuk lebih realistis -->
        <path d="M75 34H88L92 39V48H75V34Z" fill="#D97706" />

        <!-- Jendela Kabin -->
        <path
          d="M84 37H89V42H84V37Z"
          fill="white"
          stroke="#D97706"
          stroke-width="0.5"
        />

        <!-- Bak Muatan (lebih mirip bata) -->
        <rect
          x="48"
          y="18"
          width="24"
          height="14"
          fill="#F59E0B"
          stroke="#78350F"
          stroke-width="1"
        />
        <path
          d="M48 22H72M48 26H72M48 30H72"
          stroke="#78350F"
          stroke-width="0.6"
        />
        <path
          d="M52 18V32M56 22V26M60 18V32M64 22V26M68 18V32"
          stroke="#78350F"
          stroke-width="0.6"
        />

        <!-- Roda Truk -->
        <circle
          cx="53"
          cy="52"
          r="5"
          fill="white"
          stroke="#78350F"
          stroke-width="3"
        />
        <circle
          cx="83"
          cy="52"
          r="5"
          fill="white"
          stroke="#78350F"
          stroke-width="3"
        />

        <!-- Teks Logo -->
        <text
          x="94"
          y="60"
          font-family="Arial, sans-serif"
          font-size="23"
          fill="#2563EB"
          font-weight="bold"
        >
          BangunGo
        </text>
      </svg>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const primary = ref('rgb(var(--v-theme-primary))');
</script>
