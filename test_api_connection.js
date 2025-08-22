// Script para probar la conectividad con la API
const fetch = require('node-fetch');

// Configuración de prueba
const TEST_URLS = [
  'http://localhost:3001/api/event',
  'http://127.0.0.1:3001/api/event',
  'http://10.0.2.2:3001/api/event', // Para emulador Android
];

async function testConnection(url) {
  try {
    console.log(`🔍 Probando: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ÉXITO: ${url}`);
      console.log(`📊 Status: ${response.status}`);
      console.log(`📄 Datos recibidos:`, data.length || 'N/A', 'elementos');
      return true;
    } else {
      console.log(`❌ ERROR: ${url} - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${url} - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de conectividad...\n');
  
  let successCount = 0;
  
  for (const url of TEST_URLS) {
    const success = await testConnection(url);
    if (success) successCount++;
    console.log(''); // Línea en blanco
  }
  
  console.log('📋 Resumen:');
  console.log(`✅ URLs exitosas: ${successCount}/${TEST_URLS.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 ¡La API está funcionando!');
    console.log('💡 Usa la URL que funcionó en tu configuración del frontend.');
  } else {
    console.log('\n🚨 Ninguna URL funcionó. Verifica que:');
    console.log('   1. El backend esté ejecutándose (npm run dev)');
    console.log('   2. El puerto 3001 esté disponible');
    console.log('   3. No haya firewall bloqueando la conexión');
  }
}

// Ejecutar las pruebas
runTests().catch(console.error);
