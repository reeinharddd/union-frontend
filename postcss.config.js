import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default {
  plugins: [
    tailwindcss('./tailwind.config.js'),
    autoprefixer({
      // Compatibilidad con versiones anteriores de browsers
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not ie 11'
      ],
      grid: 'autoplace'
    })
  ]
};
