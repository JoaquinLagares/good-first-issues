#include <stdio.h>
// BUG: Missing #include <math.h>

int main() {
    double result = sqrt(16.0);
    printf("Square root of 16 is %.1f\n", result);
    return 0;
}
