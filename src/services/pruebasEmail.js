import 'dotenv/config';
import { mailRegistro, mailRecuperacion } from './emailService.js';

const probarEnvio = async () => {
  console.log('Enviando correos de prueba a Mailtrap...');

  await mailRegistro('prueba@cliente.com', 'Sofia Sol');

  await mailRecuperacion('prueba@cliente.com', 'token-de-prueba-123456');

  console.log('Proceso finalizado.');
};

probarEnvio();