#include <bits/stdc++.h>
using namespace std;

struct Nodo {
    unordered_map<char, Nodo*> next; // arreglo de transiciones (uno por cada caracter del alfabeto)
    Nodo* fail; // enlace de fallo
    vector<int> out; // lista de IDs de patrones que terminan en este nodo
    Nodo() : fail(nullptr) {}
};

class AhoCorasick {
    Nodo* root;
public:
    AhoCorasick() { root = new Nodo(); }

    // 1. Añadir patrón (ADD_PATTERN)
    void add_pattern(const string& P, int id) {
        Nodo* v = root;
        for (char c : P) {
            if (!v->next.count(c))
                v->next[c] = new Nodo();
            v = v->next[c];
        }
        v->out.push_back(id); // guardar id del patrón
    }

    // 2. Construcción de los enlaces de fallo (BUILD_FAILURE)
    void build_failure() {
        queue<Nodo*> Q;
        // inicializar hijos del root
        for (auto& par : root->next) {
            par.second->fail = root;
            Q.push(par.second);
        }
        // BFS
        while (!Q.empty()) {
            Nodo* v = Q.front(); 
            Q.pop();
            for (auto& par : v->next) {
                char c = par.first;
                Nodo* u = par.second;
                // encontrar el fallo
                Nodo* f = v->fail;
                while (f && !f->next.count(c)) f = f->fail;
                if (f) u->fail = f->next[c];
                else u->fail = root;
                // heredar salidas
                for (int id : u->fail->out)
                    u->out.push_back(id);
                Q.push(u);
            }
        }
    }

    // 3. Buscar patrones en texto T (SEARCH)
    vector<vector<int>> search(const string& T, const vector<string>& patrones) {
        vector<vector<int>> posiciones(patrones.size());
        Nodo* v = root;
        for (int i = 0; i < (int)T.size(); i++) {
            char c = T[i];
            while (v && !v->next.count(c)) v = v->fail;
            if (!v) v = root;
            else v = v->next[c];
            for (int id : v->out) {
                int pos = i - (int)patrones[id].size() + 1;
                posiciones[id].push_back(pos);
            }
        }
        return posiciones;
    }
};

int main() {
    string T = "abacaba";
    vector<string> patrones = {"aba", "c", "ba"};
    AhoCorasick automata;
    // ADD_PATTERN
    for (int i = 0; i < (int)patrones.size(); i++)
        automata.add_pattern(patrones[i], i);
    // BUILD_FAILURE
    automata.build_failure();
    // SEARCH
    auto resultados = automata.search(T, patrones);
    // Imprimir resultados
    for (int i = 0; i < (int)patrones.size(); i++) {
        cout << patrones[i] << ": ";
        for (int pos : resultados[i]) cout << pos << " ";
        cout << "\n";
    }
}
