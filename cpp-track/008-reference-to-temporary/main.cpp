#include <iostream>
#include <string>

std::string& getWelcome() {
    // BUG: Returning a reference to a local variable
    std::string message = "Welcome!";
    return message; // message is destroyed when function exits
}

int main() {
    std::string& welcome = getWelcome();
    std::cout << welcome << std::endl; // Accessing freed memory (undefined behavior)
    return 0;
}
