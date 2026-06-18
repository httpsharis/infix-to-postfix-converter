#include <iostream>
#include <cassert>
#include <stdexcept>

// Include your engine code directly (a simple approach for lab projects)
#include "../infix_to_postfix.cpp" 

void testValidExpressions() {
    std::cout << "Running standard evaluation tests...\n";
    
    // Assuming your evaluator returns a double
    assert(evaluatePostfix(infixToPostfix("3+5")) == 8);
    assert(evaluatePostfix(infixToPostfix("10-3*2")) == 4);
    assert(evaluatePostfix(infixToPostfix("3+5*(2-1)")) == 8);
    
    std::cout << "[PASS] All standard evaluations correct.\n";
}

void testErrorHandling() {
    std::cout << "Running error interception tests...\n";
    
    bool caughtMismatch = false;
    try {
        infixToPostfix("(3+5*2"); 
    } catch (const std::runtime_error& e) {
        caughtMismatch = true;
    }
    assert(caughtMismatch && "Failed to catch mismatched parentheses");

    std::cout << "[PASS] All errors intercepted correctly.\n";
}

int main() {
    std::cout << "--- Starting Unit Tests ---\n";
    testValidExpressions();
    testErrorHandling();
    std::cout << "--- All Tests Passed Successfully! ---\n";
    return 0;
}