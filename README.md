# Wealth Valuation Widget - Integration Guide

This guide will help you add the wealth valuation widget to your website. The widget provides an interactive chat interface that helps calculate company valuations based on AUM and revenue.

## What You'll Get

- A professional chat widget that matches iMessage styling
- Automatic valuation calculations (4.5x AUM)
- Email reports sent to your clients
- Data storage in Google Sheets
- Mobile-responsive design

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

#### A. Change the Position

Add this before the widget script to change its position:

```html
<script>
  window.WealthWidgetConfig = {
    position: 'bottom-right' // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  };
</script>
```

#### B. Change the Colors

Match your brand colors:

```html
<script>
  window.WealthWidgetConfig = {
    primaryColor: '#0B93F6',    // Main widget color
    backgroundColor: '#FFFFFF'   // Widget background
  };
</script>
```

#### C. Customize Messages

Change the widget's text:

```html
<script>
  window.WealthWidgetConfig = {
    initialMessage: 'Welcome! Let\'s calculate your company\'s value.',
    aumMessage: 'What are your Assets Under Management?',
    revenueMessage: 'What\'s your annual revenue?',
    emailMessage: 'Where should we send your valuation?'
  };
</script>
```

#### D. Full Configuration Example

Here's how to use all options together:

```html
<script>
  window.WealthWidgetConfig = {
    // Appearance
    position: 'bottom-right',
    primaryColor: '#0B93F6',
    backgroundColor: '#FFFFFF',
    
    // Messages
    initialMessage: 'Welcome! Let\'s calculate your company\'s value.',
    aumMessage: 'What are your Assets Under Management?',
    revenueMessage: 'What\'s your annual revenue?',
    emailMessage: 'Where should we send your valuation?',
    
    // Behavior
    autoOpen: false,           // Set to true to open widget automatically
    showBranding: true,        // Set to false to remove "Powered by" text
    allowMinimize: true        // Set to false to prevent widget minimization
  };
</script>
```

### 3. Accessing Your Data

The widget automatically stores all submissions in a Google Sheet. You'll receive:
1. The Google Sheet URL
2. View/edit access using your email address
3. Real-time updates as new submissions come in

The sheet includes:
- Timestamp
- Name
- AUM
- Revenue
- Email
- Calculated Valuation

### 4. Testing the Integration

1. After adding the code, refresh your website
2. Look for the chat bubble in the bottom-right corner
3. Click it to open the widget
4. Try submitting a test entry:
   - Enter a name
   - Type "1.5 million" for AUM
   - Type "3 million" for revenue
   - Use your email
5. Check your email for the valuation report
6. Log into Google Sheets with the provided credentials to verify the data appears

### Common Questions

**Q: How do I view the submitted data?**
A: Log into Google Sheets using wealthvaluationwidget@gmail.com and the provided password.

**Q: Can I style the widget to match my website?**
A: Yes, use the `primaryColor` and `backgroundColor` options in the configuration.

**Q: Will it work on mobile?**
A: Yes, the widget is fully responsive and works on all devices.

**Q: Can I change the valuation formula?**
A: Contact us to customize the valuation calculation (currently set at 4.5x AUM).

**Q: Is the data secure?**
A: Yes, all data is stored in the shared Google Sheet and transmitted securely.

### Troubleshooting

1. Widget not appearing?
   - Check if the `wealth-widget` div is present
   - Verify the script URL is correct
   - Check browser console for errors

2. Submissions not working?
   - Ensure your email address is valid
   - Check internet connection
   - Verify you can access the Google Sheet with provided credentials

3. Can't access the Google Sheet?
   - Double-check the login credentials
   - Clear browser cache and try again
   - Use an incognito window if needed

### Need Help?

Contact support for:
- Custom styling
- Advanced configurations
- Data access issues
- API access

### Updates and Maintenance

The widget automatically updates with new features and security patches. No action required on your part.

## Security Note

The provided Google account credentials are shared among all widget users. Please:
- Do not change the account password
- Do not modify other users' data in the sheet
- Do not modify any Google Cloud settings
- Contact support if you notice any issues
