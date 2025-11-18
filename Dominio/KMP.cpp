#include <bits/stdc++.h>
using namespace std;

/**
 * Archivo: KMP.cpp
 * Módulo: Dominio Algorítmico (C++)
 *
 * Propósito:
 *  Implementa el algoritmo Knuth-Morris-Pratt (KMP) para búsqueda de patrones dentro
 *  de secuencias de ADN. Este módulo constituye la lógica central del análisis del sistema.
 *
 * Estructura del archivo:
 *  1. Función buildLPS:
 *      Construye la tabla LPS necesaria para KMP, optimizando el retroceso de índices.
 *
 *  2. Función MetodoKMP:
 *      Aplica el algoritmo KMP sobre una cadena T buscando el patrón P.
 *      Devuelve un vector de posiciones donde se encuentran coincidencias.
 *
 *  3. Función main:
 *      - Recibe como entrada un string con formato:
 *            "PATRON|SECUENCIA1|SECUENCIA2|..."
 *      - Separa los elementos usando '|'.
 *      - Para cada secuencia ejecuta MetodoKMP.
 *      - Imprime posiciones separadas por ';' y cada secuencia por '|'.
 *
 * Rol dentro del sistema:
 *  - Es el núcleo de lógica algorítmica del backend.
 *  - Es invocado por el servidor mediante ejecución de proceso.
 *  - Devuelve resultados en texto plano que luego son convertidos a JSON.
 */


vector<int> buildLPS(const string& P) {
    int m = P.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;

    while (i < m) {
        if (P[i] == P[len]) {
            lps[i++] = ++len;
        }
        else {
            if (len != 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
    }
    return lps;
}

vector<int> MetodoKMP(const string& T, const string& P) {
    vector<int> ans;
    int n = T.size(), m = P.size();
    if (m == 0) return ans;

    vector<int> lps = buildLPS(P);
    int i = 0, j = 0;

    while (i < n) {
        if (T[i] == P[j]) {
            i++; j++;
            if (j == m) {
                ans.push_back(i - j);
                j = lps[j - 1];
            }
        }
        else {
            if (j != 0) j = lps[j - 1];
            else i++;
        }
    }
    return ans;
}

int main(int argc, char* argv[]) {

    // Debe haber: argv[1] = patron, argv[2...] = cadenas
    if (argc < 3) {
        cout << "" << endl;
        return 0;
    }

    string patron = argv[1];

    // Procesar cada cadena enviada como argumento
    for (int i = 2; i < argc; i++) {

        string cadena = argv[i];
        vector<int> res = MetodoKMP(cadena, patron);

        if (res.empty()) cout << "-1";
        else {
            for (int k = 0; k < res.size(); k++) {
                if (k) cout << ",";
                cout << res[k];
            }
        }

        if (i < argc - 1) cout << "|";  // separador entre resultados
    }

    return 0;
}
