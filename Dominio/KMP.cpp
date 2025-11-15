#include <bits/stdc++.h>
using namespace std;

vector<int> buildLPS(const string& P) {
    int m = P.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;

    while (i < m) {
        if (P[i] == P[len]) {
            lps[i++] = ++len;
        } else {
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
        } else {
            if (j != 0) j = lps[j - 1];
            else i++;
        }
    }
    return ans;
}

int main(int argc, char* argv[]) {

    if (argc < 2) {
        cout << "" << endl;
        return 0;
    }

    string input = argv[1];

    // Separar por "|"
    vector<string> partes;
    string temp;
    stringstream ss(input);

    while (getline(ss, temp, '|')) {
        partes.push_back(temp);
    }

    if (partes.size() < 2) {
        cout << "" << endl;
        return 0;
    }

    string patron = partes[0];

    // Procesar cada cadena y mostrar resultados
    for (int i = 1; i < partes.size(); i++) {
        vector<int> res = MetodoKMP(partes[i], patron);

        if (res.empty()) cout << "-1";
        else {
            for (int k = 0; k < res.size(); k++) {
                if (k) cout << ",";
                cout << res[k];
            }
        }

        if (i < partes.size() - 1) cout << "|";
    }

    return 0;
}
