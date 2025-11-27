import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1,               // 1 usuario
  iterations: 10        // 10 ejecuciones
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
  const res = http.get('http://localhost:4000/api/historial/', {
    headers: { Authorization: `Bearer TOKEN_AQUI` }
  });

  sleep(1);
}
