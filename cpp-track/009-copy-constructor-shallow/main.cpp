#include <iostream>
#include <cstring>

class String {
private:
    char* data;
    
public:
    String(const char* str) {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
    }
    
    // BUG: No copy constructor defined (shallow copy happens)
    
    ~String() {
        delete[] data;
    }
    
    void print() {
        std::cout << data << std::endl;
    }
};

int main() {
    String s1("Hello");
    String s2 = s1; // Both s1 and s2 point to the same memory
    
    s1.print();
    s2.print();
    
    // When s2 destructor runs, it deletes data
    // When s1 destructor runs, it tries to delete already-freed memory (double delete!)
    return 0;
}
