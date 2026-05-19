#include <stdio.h>

int main() {
    int a = 5;
    int b = 2;
    
    // BUG: Integer division 5/2 results in 2, not 2.5
    float result = a / b;
    
    printf("5 / 2 = %.1f\n", result);
    return 0;
}
