#include <iostream>

// Function declaration
void greet(std::string name = "Friend");

int main() {
    greet();
    greet("Alice");
    return 0;
}

// BUG: Default parameter in both declaration and definition (causes error in some compilers)
void greet(std::string name = "Friend") {
    std::cout << "Hello, " << name << "!" << std::endl;
}
