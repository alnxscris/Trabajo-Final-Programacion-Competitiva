#include <bits/stdc++.h>
using namespace std;

// Algoritmo Rabin-Karp
vector<int> rabinKarp(const string &text, const string &pat) {
    const int p = 31;              // número primo base
    const int mod = 1e9 + 9;       // número grande primo para evitar colisiones
    int n = text.size(), m = pat.size();

    // Potencias de p
    vector<long long> p_pow(max(n, m));
    p_pow[0] = 1;
    for (int i = 1; i < (int)p_pow.size(); i++)
        p_pow[i] = (p_pow[i - 1] * p) % mod;

    // Hash del texto (prefijos)
    vector<long long> h(n + 1, 0);
    for (int i = 0; i < n; i++) {
        h[i + 1] = (h[i] + (text[i] - 'a' + 1) * p_pow[i]) % mod;
    }

    // Hash del patrón
    long long h_pat = 0;
    for (int i = 0; i < m; i++) {
        h_pat = (h_pat + (pat[i] - 'a' + 1) * p_pow[i]) % mod;
    }

    // Comparaciones
    vector<int> result;
    for (int i = 0; i + m - 1 < n; i++) {
        long long cur_h = (h[i + m] + mod - h[i]) % mod;
        if (cur_h == (h_pat * p_pow[i]) % mod) {
            result.push_back(i); // patrón encontrado en la posición i
        }
    }
    return result;
}

int main() {
    string text, pat;

    cout << "Ingrese el texto donde buscar: ";
    getline(cin, text);

    cout << "Ingrese el patron a buscar: ";
    getline(cin, pat);

    vector<int> matches = rabinKarp(text, pat);

    if (matches.empty()) {
        cout << "\nNo se encontraron coincidencias.\n";
    } else {
        cout << "\nPatron encontrado en posiciones: ";
        for (int pos : matches)
            cout << pos << " ";
        cout << "\n";
    }

    return 0;
}