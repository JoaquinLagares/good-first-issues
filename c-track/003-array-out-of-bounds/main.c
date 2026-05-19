#include <stdio.h>

int main() {
    int numbers[3] = {10, 20, 30};
    
    // BUG: Array index starts at 0. Index 3 is out of bounds!
    printf("The third number is: %d\n", numbers[3]);
    
    return 0;
}
