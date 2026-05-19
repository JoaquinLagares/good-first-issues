#include <iostream>

class Counter {
private:
    int* value;
    
public:
    Counter(int val) {
        value = new int(val);
    }
    
    // Copy constructor (for copying)
    Counter(const Counter& other) {
        value = new int(*other.value);
    }
    
    // BUG: Missing copy assignment operator
    // c1 = c2; will do shallow copy instead of deep copy
    
    ~Counter() {
        delete value;
    }
    
    void print() {
        std::cout << "Value: " << *value << std::endl;
    }
};

int main() {
    Counter c1(5);
    Counter c2(10);
    
    c1 = c2; // Assignment without custom operator= (shallow copy)
    
    c1.print();
    c2.print();
    
    // When c2 destructor runs, it deletes the value
    // When c1 destructor runs, it tries to delete the same memory (double delete!)
    return 0;
}
