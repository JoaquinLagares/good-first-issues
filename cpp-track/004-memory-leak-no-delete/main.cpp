#include <iostream>

int main() {
    // BUG: Allocating memory with 'new' but never calling 'delete'
    int* data = new int[100];
    
    for(int i = 0; i < 100; i++) {
        data[i] = i;
    }
    
    std::cout << "Data processed!" << std::endl;
    
    // Memory leak here
    return 0;
}
