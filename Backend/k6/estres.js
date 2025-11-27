import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },   // sube a 10 usuarios
    { duration: '10s', target: 25 },   // sube a 25
    { duration: '10s', target: 50 },   // sube a 50
    { duration: '10s', target: 80 },   // sube a 80
    { duration: '10s', target: 0 }     // baja a 0 (recuperación)
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
