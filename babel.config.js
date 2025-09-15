export default function(api) {
  // Caching the configuration based on the environment
  api.cache.using(() => process.env.NODE_ENV === 'development');

  return {
    presets: [
      // Preset for compiling ECMAScript 6+ to a compatible version of JavaScript
      '@babel/preset-env',
      
      // Preset for transforming JSX syntax to JavaScript
      '@babel/preset-react'
    ]
  };
};