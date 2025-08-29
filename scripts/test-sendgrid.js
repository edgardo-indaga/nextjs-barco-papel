// Script para probar SendGrid sin servidor
const sgMail = require('@sendgrid/mail');

// Configurar API key desde variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGrid() {
    const msg = {
        to: process.env.SENDGRID_FROM_EMAIL, // Enviar a ti mismo para probar
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: process.env.SENDGRID_FROM_NAME || 'Barco de Papel'
        },
        subject: 'Prueba SendGrid - Configuración exitosa',
        text: 'Si recibes este email, SendGrid está configurado correctamente.',
        html: `
            <h2>🎉 ¡SendGrid configurado correctamente!</h2>
            <p>Si recibes este email, significa que la configuración de SendGrid está funcionando.</p>
            <p><strong>Detalles de la prueba:</strong></p>
            <ul>
                <li>Fecha: ${new Date().toLocaleString('es-ES')}</li>
                <li>From: ${process.env.SENDGRID_FROM_EMAIL}</li>
                <li>Service: SendGrid</li>
            </ul>
            <p>Ahora puedes usar el sistema de recuperación de contraseña.</p>
        `
    };

    try {
        console.log('📧 Enviando email de prueba...');
        console.log('From:', msg.from.email);
        console.log('To:', msg.to);
        
        const response = await sgMail.send(msg);
        
        console.log('✅ Email enviado exitosamente!');
        console.log('Message ID:', response[0]?.headers?.['x-message-id'] || 'No ID');
        console.log('Status Code:', response[0]?.statusCode);
        
        return true;
    } catch (error) {
        console.error('❌ Error enviando email:');
        
        if (error.response) {
            console.error('Status:', error.response.statusCode);
            console.error('Body:', JSON.stringify(error.response.body, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        
        return false;
    }
}

// Verificar configuración antes de enviar
function checkConfiguration() {
    const requiredVars = [
        'SENDGRID_API_KEY',
        'SENDGRID_FROM_EMAIL',
        'SENDGRID_FROM_NAME'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error('❌ Variables de entorno faltantes:');
        missing.forEach(varName => console.error(`  - ${varName}`));
        return false;
    }
    
    if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
        console.error('❌ SENDGRID_API_KEY parece ser inválida (debe comenzar con "SG.")');
        return false;
    }
    
    console.log('✅ Configuración verificada:');
    console.log(`  - API Key: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);
    console.log(`  - From Email: ${process.env.SENDGRID_FROM_EMAIL}`);
    console.log(`  - From Name: ${process.env.SENDGRID_FROM_NAME}`);
    
    return true;
}

// Ejecutar prueba
async function main() {
    console.log('🔧 Verificando configuración SendGrid...\n');
    
    if (!checkConfiguration()) {
        process.exit(1);
    }
    
    console.log('\n📧 Iniciando prueba de envío...\n');
    
    const success = await testSendGrid();
    
    if (success) {
        console.log('\n🎉 ¡SendGrid configurado correctamente!');
        console.log('Revisa tu bandeja de entrada para confirmar la recepción del email.');
    } else {
        console.log('\n❌ Error en la configuración de SendGrid.');
        console.log('Revisa tu API key y configuración de sender authentication.');
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}