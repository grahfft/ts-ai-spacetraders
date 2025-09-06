import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🚀 TS AI Space Traders starting up...');

// Main application entry point
async function main() {
  try {
    console.log('✅ Application initialized successfully');
    console.log('🎯 Ready to trade in space!');
    
    // TODO: Initialize AI agent and start game loop
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

// Start the application
main();
