const fs = require('fs');
const path = require('path');

// Function to extract endpoint info from route file
function analyzeRouteFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = filePath.replace(process.cwd() + '/', '');

  // Extract HTTP methods
  const methods = [];
  if (content.includes('export async function GET')) methods.push('GET');
  if (content.includes('export async function POST')) methods.push('POST');
  if (content.includes('export async function PUT')) methods.push('PUT');
  if (content.includes('export async function DELETE')) methods.push('DELETE');
  if (content.includes('export async function PATCH')) methods.push('PATCH');

  // Extract imports to check dependencies
  const hasAuth = content.includes('auth') || content.includes('jwt') || content.includes('session');
  const hasDB = content.includes('prisma') || content.includes('@/lib/db');
  const hasValidation = content.includes('zod') || content.includes('schema');
  const hasAI = content.includes('openai') || content.includes('anthropic') || content.includes('ai');

  // Check for error handling
  const hasErrorHandling = content.includes('try') && content.includes('catch');

  // Extract route path from file path
  const routePath = filePath
    .replace(process.cwd() + '/app/api', '')
    .replace('/route.ts', '')
    .replace(/\[([^\]]+)\]/g, ':$1');

  return {
    path: routePath,
    file: relativePath,
    methods,
    features: {
      authentication: hasAuth,
      database: hasDB,
      validation: hasValidation,
      aiIntegration: hasAI,
      errorHandling: hasErrorHandling
    },
    status: methods.length > 0 ? 'implemented' : 'empty'
  };
}

// Function to analyze backend service
function analyzeBackendService(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.ts');

  // Check for exports
  const hasExports = content.includes('export');
  const hasClass = content.includes('class ');
  const hasInterface = content.includes('interface ');

  // Check dependencies
  const dependencies = [];
  if (content.includes('prisma')) dependencies.push('database');
  if (content.includes('redis')) dependencies.push('cache');
  if (content.includes('openai')) dependencies.push('openai');
  if (content.includes('anthropic')) dependencies.push('anthropic');
  if (content.includes('razorpay')) dependencies.push('payment');
  if (content.includes('twilio')) dependencies.push('sms');
  if (content.includes('sendgrid')) dependencies.push('email');
  if (content.includes('aws')) dependencies.push('aws');

  return {
    name: fileName,
    hasExports,
    hasClass,
    hasInterface,
    dependencies,
    status: hasExports ? 'implemented' : 'stub'
  };
}

// Scan all API routes
console.log('🔍 ANALYZING API ENDPOINTS\n');
console.log('=' .repeat(80));

const apiDir = path.join(process.cwd(), 'app/api');
const endpoints = [];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file === 'route.ts') {
      endpoints.push(analyzeRouteFile(fullPath));
    }
  });
}

scanDirectory(apiDir);

// Group endpoints by category
const categories = {};
endpoints.forEach(ep => {
  const category = ep.path.split('/')[1] || 'root';
  if (!categories[category]) categories[category] = [];
  categories[category].push(ep);
});

// Print endpoints by category
Object.keys(categories).sort().forEach(category => {
  console.log(`\n📁 ${category.toUpperCase()}`);
  console.log('-'.repeat(40));

  categories[category].forEach(ep => {
    const methods = ep.methods.length > 0 ? ep.methods.join(', ') : 'NONE';
    const status = ep.status === 'implemented' ? '✅' : '❌';

    console.log(`${status} ${ep.path}`);
    console.log(`   Methods: ${methods}`);
    console.log(`   Features: Auth:${ep.features.authentication ? '✓' : '✗'} DB:${ep.features.database ? '✓' : '✗'} Validation:${ep.features.validation ? '✓' : '✗'} AI:${ep.features.aiIntegration ? '✓' : '✗'} ErrorHandling:${ep.features.errorHandling ? '✓' : '✗'}`);
  });
});

// Analyze backend services
console.log('\n\n🔧 BACKEND SERVICES ANALYSIS\n');
console.log('=' .repeat(80));

const backendDir = path.join(process.cwd(), 'backend/lib');
const services = [];

function scanBackendDirectory(dir, category = '') {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanBackendDirectory(fullPath, file);
    } else if (file.endsWith('.ts')) {
      const service = analyzeBackendService(fullPath);
      service.category = category;
      services.push(service);
    }
  });
}

scanBackendDirectory(backendDir);

// Group services by category
const serviceCategories = {};
services.forEach(service => {
  const cat = service.category || 'root';
  if (!serviceCategories[cat]) serviceCategories[cat] = [];
  serviceCategories[cat].push(service);
});

// Print services by category
Object.keys(serviceCategories).sort().forEach(category => {
  console.log(`\n📦 ${category.toUpperCase()}`);
  console.log('-'.repeat(40));

  serviceCategories[category].forEach(service => {
    const status = service.status === 'implemented' ? '✅' : '⚠️';
    const deps = service.dependencies.length > 0 ? service.dependencies.join(', ') : 'none';

    console.log(`${status} ${service.name}`);
    console.log(`   Dependencies: ${deps}`);
  });
});

// Summary statistics
console.log('\n\n📊 SUMMARY STATISTICS\n');
console.log('=' .repeat(80));

const totalEndpoints = endpoints.length;
const implementedEndpoints = endpoints.filter(ep => ep.status === 'implemented').length;
const endpointsWithAuth = endpoints.filter(ep => ep.features.authentication).length;
const endpointsWithDB = endpoints.filter(ep => ep.features.database).length;
const endpointsWithAI = endpoints.filter(ep => ep.features.aiIntegration).length;

console.log(`Total API Endpoints: ${totalEndpoints}`);
console.log(`Implemented: ${implementedEndpoints} (${Math.round(implementedEndpoints/totalEndpoints*100)}%)`);
console.log(`With Authentication: ${endpointsWithAuth} (${Math.round(endpointsWithAuth/totalEndpoints*100)}%)`);
console.log(`With Database: ${endpointsWithDB} (${Math.round(endpointsWithDB/totalEndpoints*100)}%)`);
console.log(`With AI Integration: ${endpointsWithAI} (${Math.round(endpointsWithAI/totalEndpoints*100)}%)`);

console.log(`\nTotal Backend Services: ${services.length}`);
console.log(`Implemented: ${services.filter(s => s.status === 'implemented').length}`);

// Method coverage
const methodCounts = {};
endpoints.forEach(ep => {
  ep.methods.forEach(method => {
    methodCounts[method] = (methodCounts[method] || 0) + 1;
  });
});

console.log('\n📈 HTTP Method Distribution:');
Object.entries(methodCounts).forEach(([method, count]) => {
  console.log(`   ${method}: ${count} endpoints`);
});

console.log('\n✨ Analysis Complete!\n');