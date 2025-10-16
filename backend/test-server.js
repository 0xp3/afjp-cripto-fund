const { spawn } = require('child_process');

console.log('🧪 Testing AFJP Crypto Backend Server...\n');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-secret-key';
process.env.APTOS_NODE_URL = 'https://fullnode.devnet.aptoslabs.com';
process.env.AFJP_MODULE_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

// Start the server
const server = spawn('node', ['dist/index.js'], {
  env: process.env,
  stdio: 'pipe'
});

let serverStarted = false;
let serverOutput = '';

server.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.log('📟 Server Output:', output.trim());
  
  if (output.includes('AFJP Crypto Backend running on port')) {
    serverStarted = true;
    console.log('✅ Server started successfully!');
    
    // Test a simple endpoint
    setTimeout(() => {
      testHealthEndpoint();
    }, 1000);
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString();
  console.log('❌ Server Error:', error.trim());
});

server.on('close', (code) => {
  console.log(`\n🔚 Server process exited with code ${code}`);
  if (serverStarted) {
    console.log('✅ Test completed successfully!');
    process.exit(0);
  } else {
    console.log('❌ Server failed to start');
    process.exit(1);
  }
});

// Kill server after 10 seconds
setTimeout(() => {
  if (server.pid) {
    console.log('\n⏰ Test timeout - killing server...');
    server.kill('SIGTERM');
  }
}, 10000);

function testHealthEndpoint() {
  const http = require('http');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('🌐 Root Endpoint Response:', data);
      
      // Test health endpoint
      testHealthEndpoint2();
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Request error:', err.message);
    server.kill('SIGTERM');
  });
  
  req.end();
}

function testHealthEndpoint2() {
  const http = require('http');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('💚 Health Endpoint Response:', data);
      console.log('✅ All tests completed successfully!');
      server.kill('SIGTERM');
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Health check error:', err.message);
    server.kill('SIGTERM');
  });
  
  req.end();
}
