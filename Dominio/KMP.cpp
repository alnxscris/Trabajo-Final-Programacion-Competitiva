#include <bits/stdc++.h>
using namespace std;
vector<int> buildLPS(const string& P) {
    int m = (int)P.size();
    vector<int> lps(m, 0);
    int len = 0;
    int i = 1;

    while (i < m) {
        if (P[i] == P[len]) {
            len++;
            lps[i] = len;
            i++;
        }
        else {
            if (len != 0) {
                len = lps[len - 1];
            }
            else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

vector<int> MetodoKMP(const string& T, const string& P) {
	vector<int> ans; // Almacena las posiciones de las ocurrencias de P en T
    int n = (int)T.size();
    int m = (int)P.size();

    if (m == 0) {
		return ans; // Si P es una cadena vac�a, no hay ocurrencias
    }

    vector<int> lps = buildLPS(P);
    int i = 0;
    int j = 0;

    while (i < n) {
        if (T[i] == P[j]) {
            i++;
            j++;
            if (j == m) {
				ans.push_back(i - j); // Se encontr� una ocurrencia de P en T
                j = lps[j - 1];
            }
        }
        else {
            if (j != 0) {
                j = lps[j - 1];
            }
            else {
                i++;
            }
        }
    }
    return ans;
}

int main()
{
    string T, P;
    cout << "Ingrese T: ";
	if (!getline(cin, T)) return 0; // Cierra el programa al ingresar algo diferente a una cadena
    cout << "Ingrese P: ";
    if (!getline(cin, P)) return 0; 

	vector<int> ans = MetodoKMP(T, P); // Encuentra todas las ocurrencias de P en T

	for (int k = 0; k < (int)ans.size(); ++k) { // Imprime las posiciones de las ocurrencias
        if (k) cout << ' ';
        cout << ans[k];
    }
    cout << '\n';
    return 0;
}