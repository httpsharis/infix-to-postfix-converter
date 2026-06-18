#include <iostream>
#include <string>
#include "infix_to_postfix.cpp" // Imports your tested core logic

int main(int argc, char* argv[]) {
    // 1. Ensure Next.js actually passed an equation
    if (argc < 2) {
        std::cerr << "{\"status\": \"error\", \"message\": \"No expression provided to engine.\"}\n";
        return 1;
    }

    std::string expression = argv[1];

    try {
        // 2. Run your algorithms
        std::vector<Token> postfixTokens = infixToPostfix(expression);
        double result = evaluatePostfix(postfixTokens);

        // 3. Format the output queue into a readable string
        std::string postfixStr = "";
        for (size_t i = 0; i < postfixTokens.size(); ++i) {
            postfixStr += postfixTokens[i].value;
            if (i < postfixTokens.size() - 1) postfixStr += " "; // Add spaces between tokens
        }

        // 4. Print strictly formatted JSON to standard output
        std::cout << "{"
                  << "\"status\": \"success\", "
                  << "\"infix\": \"" << expression << "\", "
                  << "\"postfix\": \"" << postfixStr << "\", "
                  << "\"result\": " << result
                  << "}\n";

    } catch (const std::exception& e) {
        // Intercept your runtime_errors and send them to the web app gracefully
        std::cerr << "{\"status\": \"error\", \"message\": \"" << e.what() << "\"}\n";
        return 1;
    }

    return 0;
}