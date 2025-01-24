const esbuild = require('esbuild');
const path = require('path');
const config = require('../widget.config.js');

async function build() {
  try {
    // Build the widget
    await esbuild.build({
      entryPoints: [config.widget.entry],
      bundle: true,
      minify: true,
      format: 'iife',
      globalName: 'WealthWidget',
      outfile: path.join(config.widget.output.directory, config.widget.output.filename),
      external: Object.keys(config.widget.externals),
      loader: { '.tsx': 'tsx', '.ts': 'ts' },
      define: {
        'process.env.NODE_ENV': '"production"'
      },
    });

    // Create the loader script
    await esbuild.build({
      stdin: {
        contents: `
          (function() {
            // Load required dependencies
            function loadScript(src) {
              return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
              });
            }

            // Initialize the widget
            async function initWidget() {
              try {
                // Load dependencies
                await Promise.all([
                  loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
                  loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'),
                  loadScript('https://unpkg.com/framer-motion/dist/framer-motion.js')
                ]);

                // Load and initialize the widget
                await loadScript('https://your-domain.com/widget.js');
                
                // Create widget container
                const container = document.createElement('div');
                container.id = 'wealth-widget-root';
                document.body.appendChild(container);

                // Initialize the widget
                window.WealthWidget.mount('#wealth-widget-root');
              } catch (error) {
                console.error('Failed to load Wealth Widget:', error);
              }
            }

            // Start initialization
            initWidget();
          })();
        `,
        loader: 'js',
      },
      bundle: true,
      minify: true,
      outfile: path.join(config.widget.output.directory, 'loader.js'),
    });

    console.log('✅ Widget built successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
