module.exports = {
  // Widget configuration
  widget: {
    name: 'wealth-widget',
    version: '1.0.0',
    // Entry point for the widget
    entry: './src/components/wealth-widget.tsx',
    // Output configuration
    output: {
      directory: './dist',
      filename: 'widget.js',
    },
    // CDN dependencies to be loaded externally
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'framer-motion': 'FramerMotion'
    }
  }
};
