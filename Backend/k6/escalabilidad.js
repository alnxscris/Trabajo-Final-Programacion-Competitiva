import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 5 },    // carga baja
    { duration: '15s', target: 15 },   // carga media
    { duration: '15s', target: 30 },   // carga alta
    { duration: '15s', target: 45 }    // carga muy alta
  ]
};

export default function () {
    // Usamos: http://localhost:4000/api/historial/
    // porque es el único endpoint que cumple con:
    // no necesita archivo
    // permite usar JWT
    // golpea MySQL
    // simula carga real
    // es seguro de bombardear
    // es representativo del uso real del sistema
    
  http.get('http://localhost:4000/api/historial/', {
    headers: { Authorization: `Bearer TOKEN_AQUI` }
  });

  sleep(1);
}
