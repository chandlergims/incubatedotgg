#!/usr/bin/env node

/**
 * Cron job script to update token prices every 5 minutes
 * This script calls the /api/update-prices endpoint
 */

const https = require('https');
const http = require('http');

// Get the base URL from environment variables
const BASE_URL = process.env.RAILWAY_STATIC_URL || process.env.VERCEL_URL || process.env.BASE_URL || 'http://localhost:3000';

// Ensure the URL has the correct protocol
const apiUrl = BASE_URL.startsWith('http') ? BASE_URL : `https://${BASE_URL}`;
const endpoint = `${apiUrl}/api/update-prices`;

console.log(`🕐 [${new Date().toISOString()}] Starting price update cron job...`);
console.log(`🎯 Target endpoint: ${endpoint}`);

// Function to make the API call
function updatePrices() {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'receipts.fun-cron-job/1.0'
      },
      timeout: 300000 // 5 minute timeout
    };

    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ [${new Date().toISOString()}] Price update successful:`, response);
            resolve(response);
          } else {
            console.error(`❌ [${new Date().toISOString()}] Price update failed with status ${res.statusCode}:`, response);
            reject(new Error(`HTTP ${res.statusCode}: ${response.error || 'Unknown error'}`));
          }
        } catch (error) {
          console.error(`❌ [${new Date().toISOString()}] Failed to parse response:`, error);
          console.error('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ [${new Date().toISOString()}] Request failed:`, error);
      reject(error);
    });

    req.on('timeout', () => {
      console.error(`❌ [${new Date().toISOString()}] Request timed out after 5 minutes`);
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Main execution
async function main() {
  try {
    const result = await updatePrices();
    console.log(`🎉 [${new Date().toISOString()}] Cron job completed successfully`);
    console.log(`📊 Updated ${result.updatedCount || 0} prices and ${result.feeUpdatedCount || 0} fee records`);
    process.exit(0);
  } catch (error) {
    console.error(`💥 [${new Date().toISOString()}] Cron job failed:`, error.message);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log(`🛑 [${new Date().toISOString()}] Cron job interrupted`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log(`🛑 [${new Date().toISOString()}] Cron job terminated`);
  process.exit(1);
});

// Run the main function
main();
