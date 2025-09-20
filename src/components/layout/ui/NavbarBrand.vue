<template>
    <router-link 
      :to="to" 
      class="navbar-brand" 
      :class="linkClasses"
      :style="linkStyle"
    >
      <!-- Opção com imagem -->
      <img 
        v-if="imgSrc" 
        :src="imgSrc" 
        :alt="altText" 
        :style="getImgStyle"
        class="navbar-brand-img"
      >
      
      <!-- Opção com texto apenas -->
      <span v-else-if="brandText" :style="getTextStyle">
        {{ brandText }}
      </span>
      
      <!-- Opção com slot personalizado -->
      <slot v-else>
        <!-- Conteúdo padrão caso não tenha img, text ou slot -->
        <span class="brand-default">MyApp</span>
      </slot>
    </router-link>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    // URL da imagem do logo
    imgSrc: {
      type: String,
      default: ''
    },
    
    // Texto alternativo para a imagem
    altText: {
      type: String,
      default: 'Logo'
    },
    
    // Texto da marca (se não usar imagem)
    brandText: {
      type: String,
      default: ''
    },
    
    // Rota para redirecionamento
    to: {
      type: [String, Object],
      default: '/'
    },
    
    // Classes CSS adicionais para o link
    linkClasses: {
      type: [String, Array, Object],
      default: ''
    },
    
    // Estilos inline para o link
    linkStyle: {
      type: [Object],
      default: () => ({})
    },
    
    // Estilos inline para a imagem
    imgStyle: {
      type: [Object],
      default: () => ({})
    },
    
    // Estilos inline para o texto
    textStyle: {
      type: [Object],
      default: () => ({})
    },
    
    // Largura máxima da imagem
    imgMaxWidth: {
      type: [String, Number],
      default: '150px'
    },
    
    // Altura máxima da imagem
    imgMaxHeight: {
      type: [String, Number],
      default: '50px'
    }
  })
  
  // Estilos computados para a imagem (AGORA USADO)
  const getImgStyle = computed(() => {
    const baseStyle = {
      'max-width': typeof props.imgMaxWidth === 'number' 
        ? `${props.imgMaxWidth}px` 
        : props.imgMaxWidth,
      'max-height': typeof props.imgMaxHeight === 'number' 
        ? `${props.imgMaxHeight}px` 
        : props.imgMaxHeight,
      'height': 'auto',
      'object-fit': 'contain'
    }
    
    return { ...baseStyle, ...props.imgStyle }
  })
  
  // Estilos computados para o texto (AGORA USADO)
  const getTextStyle = computed(() => {
    const baseStyle = {
      'font-weight': '600',
      'font-size': '1.25rem',
      'color': 'inherit',
      'text-decoration': 'none'
    }
    
    return { ...baseStyle, ...props.textStyle }
  })
  </script>
  
  <style scoped>
  .navbar-brand {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }
  
  .navbar-brand:hover {
    opacity: 0.8;
  }
  
  .navbar-brand-img {
    transition: transform 0.2s ease;
  }
  
  .navbar-brand:hover .navbar-brand-img {
    transform: scale(1.05);
  }
  
  .brand-default {
    font-weight: 700;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Classes utilitárias comuns */
  .justify-content-center {
    justify-content: center !important;
  }
  
  .text-center {
    text-align: center !important;
  }
  
  .mx-auto {
    margin-left: auto !important;
    margin-right: auto !important;
  }
  
  .mb-0 {
    margin-bottom: 0 !important;
  }
  
  .mb-1 {
    margin-bottom: 0.25rem !important;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem !important;
  }
  
  .mb-3 {
    margin-bottom: 1rem !important;
  }
  
  .mb-4 {
    margin-bottom: 1.5rem !important;
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .navbar-brand-img {
      max-width: 120px !important;
      max-height: 40px !important;
    }
    
    .brand-default {
      font-size: 1.25rem;
    }
  }
  
  @media (max-width: 576px) {
    .navbar-brand-img {
      max-width: 100px !important;
      max-height: 35px !important;
    }
  }
  </style>