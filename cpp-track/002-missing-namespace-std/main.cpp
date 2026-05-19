#include <iostream>

int main() {
    // BUG: string, cout, and endl are in the 'std' namespace
    string name = "Bugs";
    cout << "Hello " << name << endl;
    return 0;
}
