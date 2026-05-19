#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {1, 2, 3};
    
    // BUG: Trying to access index 3 using .at()
    // It will throw an exception instead of returning garbage
    try {
        std::cout << nums.at(3) << std::endl;
    } catch (const std::out_of_range& e) {
        std::cerr << "Caught: " << e.what() << std::endl;
    }
    
    return 0;
}
