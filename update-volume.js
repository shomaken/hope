const fs = require('fs');
const path = require('path');

// Function to update volume data
function updateVolumeData(newAccumulatedVolume, newLastVolumeReset) {
  const volumeDataPath = path.join(__dirname, 'public', 'volume-data.json');
  
  try {
    // Read current data
    const currentData = JSON.parse(fs.readFileSync(volumeDataPath, 'utf8'));
    
    // Update data
    const updatedData = {
      ...currentData,
      accumulatedVolume: newAccumulatedVolume,
      lastVolumeReset: newLastVolumeReset,
      lastUpdated: new Date().toISOString()
    };
    
    // Write back to file
    fs.writeFileSync(volumeDataPath, JSON.stringify(updatedData, null, 2));
    
    console.log('✅ Volume data updated successfully!');
    console.log('📊 New accumulated volume:', newAccumulatedVolume);
    console.log('🕒 Last volume reset:', new Date(newLastVolumeReset).toLocaleString());
    
  } catch (error) {
    console.error('❌ Error updating volume data:', error.message);
  }
}

// Example usage:
// node update-volume.js 500000 1703123456789
if (process.argv.length >= 4) {
  const newVolume = parseFloat(process.argv[2]);
  const newResetTime = parseInt(process.argv[3]);
  
  if (!isNaN(newVolume) && !isNaN(newResetTime)) {
    updateVolumeData(newVolume, newResetTime);
  } else {
    console.log('❌ Invalid arguments. Usage: node update-volume.js <volume> <timestamp>');
  }
} else {
  console.log('📝 Volume Data Updater');
  console.log('Usage: node update-volume.js <accumulated_volume> <last_reset_timestamp>');
  console.log('');
  console.log('Example:');
  console.log('  node update-volume.js 500000 1703123456789');
  console.log('');
  console.log('To get current timestamp: Date.now() in browser console');
} 