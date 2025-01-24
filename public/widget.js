(function() {
  // Load widget styles
  const style = document.createElement('style');
  style.textContent = `
    #wealth-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
  `;
  document.head.appendChild(style);

  // Create widget iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://[YOUR-DEPLOYMENT-URL]/widget'; // You'll provide this URL
  iframe.style.border = 'none';
  iframe.style.width = '400px';
  iframe.style.height = '600px';
  iframe.style.backgroundColor = 'transparent';

  // Add iframe to container
  const container = document.getElementById('wealth-widget');
  if (container) {
    container.appendChild(iframe);
  }

  // Handle configuration
  const config = window.WealthWidgetConfig || {};
  if (config.position) {
    container.style.position = 'fixed';
    if (config.position === 'bottom-left') {
      container.style.left = '20px';
      container.style.bottom = '20px';
    } else if (config.position === 'top-right') {
      container.style.right = '20px';
      container.style.top = '20px';
    } else if (config.position === 'top-left') {
      container.style.left = '20px';
      container.style.top = '20px';
    }
  }

  // Pass configuration to iframe
  iframe.onload = function() {
    iframe.contentWindow.postMessage({
      type: 'WIDGET_CONFIG',
      config: {
        ...config,
        // The shared credentials will be handled server-side
        // No sensitive data is exposed here
      }
    }, '*');
  };
})();
