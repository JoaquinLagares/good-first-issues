#include <iostream>

int main() {
    // BUG: Wrong stream operator (>> instead of <<)
    std::cout >> "Welcome to C++!" >> std::endl;
    return 0;
}
