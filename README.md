# $HOPE Website - React App

A React-based website for $HOPE, a charitable token supporting the Children Cancer Center of Lebanon.

## Features

- **Live Token Data**: Real-time price, market cap, volume, and holders from Dexscreener API
- **Donation Tracking**: Calculates raised amount as 0.897% of 24h trading volume
- **Wallet Balance**: Tracks actual wallet balance for verification
- **Responsive Design**: Mobile-friendly modern UI
- **Debug Panel**: Press 'D' to toggle detailed debug information

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Dexscreener API**:
   - Using public Dexscreener API (no API key required)
   - Endpoint: `https://api.dexscreener.com/latest/dex/tokens/{TOKEN_ADDRESS}`

3. **Volume Data Setup** (for all-time tracking):
   - **Option A: Local JSON file** (default)
     - Edit `public/volume-data.json` manually
     - Use `node update-volume.js <volume> <timestamp>` to update
   
   - **Option B: JSONBin.io** (recommended for production)
     - Create free account at [jsonbin.io](https://jsonbin.io)
     - Create a new bin with your volume data
     - Replace `YOUR_BIN_ID` in `src/App.js`
   
   - **Option C: GitHub** (free hosting)
     - Upload `volume-data.json` to a GitHub repository
     - Replace `YOUR_USERNAME/YOUR_REPO` in `src/App.js`

4. **Add Logo**:
   - Place your logo file as `logo.png` in the `public` folder

5. **Start Development Server**:
   ```bash
   npm start
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```

## Configuration

### Token Address
- **Contract**: `3ofiPaQdD6GcspNXSk6xQqB1wzEtJALikfcSmeqqBAGS`
- **Wallet**: `HgumbJ177nwwbSXApgXdv6vZQeW1pwehQbjzqdNRwDTy`

### Update Frequency
- **Data Refresh**: Every 1 minute
- **API Sources**: Dexscreener (token data), Solana RPC (wallet balance), CoinGecko (SOL price)

## API Endpoints Used

- **Dexscreener Token Data**: `https://api.dexscreener.com/latest/dex/tokens/{TOKEN_ADDRESS}`
- **Solana RPC**: `https://api.mainnet-beta.solana.com`
- **CoinGecko SOL Price**: `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`

## Features

### Live Data Display
- Token price with 8 decimal precision
- Market capitalization
- 24-hour trading volume
- Number of holders (N/A - not provided by Dexscreener API)
- Calculated donation amount

### Donation Calculation
- **Formula**: 24h Volume × 0.897%
- **Display**: Full number with comma formatting
- **Update**: Real-time as volume changes

### Debug Panel
- Press 'D' key to toggle
- Shows API call count, raw data, and timestamps
- Useful for monitoring and troubleshooting

## Technologies Used

- **React 18** - Frontend framework
- **CSS3** - Styling with modern features
- **Fetch API** - Data fetching
- **Dexscreener API** - Multi-chain token data
- **Solana RPC** - Blockchain data

## File Structure

```
src/
├── App.js          # Main React component
├── index.js        # React entry point
└── index.css       # Global styles

public/
├── index.html      # HTML template
└── logo.png        # Logo file (add your own)

package.json        # Dependencies and scripts
README.md          # This file
```

## Troubleshooting

### API Issues
- Dexscreener API is public (no API key required)
- Ensure you have internet connection
- Check browser console for error messages

### Volume Data Issues
- Check that `volume-data.json` is accessible
- Verify JSON format is correct
- Use debug panel to see which source loaded successfully

### Data Not Updating
- Verify API endpoints are accessible
- Check rate limiting on APIs
- Use debug panel to monitor API calls

### Styling Issues
- Ensure all CSS classes are properly applied
- Check for conflicting styles
- Verify responsive breakpoints

## Support

For issues or questions, check the debug panel (press 'D') for detailed information about API calls and data flow. 