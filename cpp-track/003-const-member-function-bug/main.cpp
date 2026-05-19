#include <iostream>

class Counter {
public:
    int value = 0;
    
    // BUG: This function should be const because it only retrieves data
    void show() {
        std::cout << "Value: " << value << std::endl;
    }
};

void printCounter(const Counter& c) {
    // BUG: Cannot call non-const member function on a const reference
    c.show();
}

int main() {
    Counter myc;
    printCounter(myc);
    return 0;
}
