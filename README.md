# Wealth Valuation Widget v2 - Integration Guide

This guide will help you add the wealth valuation widget to your website. The widget provides an interactive chat interface that helps calculate company valuations based on AUM and revenue.

## Features

- Professional chat interface with modern animations and iMessage-style design
- Sophisticated valuation calculations based on AUM tiers:
  * Under 500MM:
    - 1x multiplier for Brokerage AUM
    - 3x multiplier for Advisory AUM
  * 500MM or more:
    - 2x multiplier for Brokerage AUM
    - 5x multiplier for Advisory AUM
  * 1B or more:
    - 2x multiplier for Brokerage AUM
    - 7x multiplier for Advisory AUM
- Separate inputs for Brokerage and Advisory AUM
- Legal disclaimer with clear terms
- Email reports sent to clients
- Data storage in Google Sheets
- Fully responsive design for all devices
- Dark mode support

## Data Access Credentials

### Google Account Access
To view your form submissions and manage the data:
- **Email**: wealthvaluationwidget@gmail.com
- **Password**: Wealthvaluation1!

This account gives you access to:
1. The Google Sheet containing all form submissions
2. Google Cloud Platform settings
3. Email notification settings

### Accessing Your Data

1. Go to [Google Sheets](https://sheets.google.com)
2. Sign in with the credentials above
3. Open "Wealth Widget Submissions" from the recent files
4. All form submissions will appear here automatically

## Step-by-Step Integration

### 1. Basic Integration (5 minutes)

Add this code where you want the widget to appear on your website:

```html
<!-- Step 1: Add the widget container -->
<div id="wealth-widget"></div>

<!-- Step 2: Add the widget script -->
<script src="https://[PROVIDED-URL]/widget.js"></script>
```

That's it! The widget will appear as a chat bubble in the bottom-right corner of your website.

### 2. Customizing the Widget (Optional)

You can customize various aspects of the widget:

```html
<script>
  window.wealthWidgetConfig = {
    darkMode: true, // Enable dark mode
    position: 'bottom-right', // Widget position
    initialMessage: 'Custom welcome message' // Override default welcome message
  };
</script>
```

## Understanding the Valuation Formula

The widget uses a tiered valuation system based on total AUM:

1. For practices under $500 million in total AUM:
   - Brokerage AUM is valued at 1x
   - Advisory AUM is valued at 3x

2. For practices with $500 million to $1 billion in total AUM:
   - Brokerage AUM is valued at 2x
   - Advisory AUM is valued at 5x

3. For practices with $1 billion or more in total AUM:
   - Brokerage AUM is valued at 2x
   - Advisory AUM is valued at 7x

Example calculation:
- Brokerage AUM: $1M
- Advisory AUM: $5M
- Total AUM: $6M (falls under tier 1)
- Valuation: ($1M × 1) + ($5M × 3) = $16M

## Troubleshooting

### Common Issues

1. Widget not appearing?
   - Check if the script is loaded correctly
   - Verify there are no JavaScript errors in the console
   - Ensure the container div exists on the page

2. Valuation not calculating?
   - Make sure to enter numbers only
   - Use standard formats (e.g., "1 million" or "1000000")
   - Check for any error messages in the chat

3. Can't access the Google Sheet?
   - Double-check the login credentials
   - Clear browser cache and try again
   - Use an incognito window if needed

### Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Review the troubleshooting steps above
3. Contact support with:
   - Screenshot of the issue
   - Browser and device details
   - Steps to reproduce the problem

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - feel free to modify and use in your own projects!
