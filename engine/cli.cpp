#include <iostream>
#include <string>
#include <vector>
#include "infix_to_postfix.cpp" // Imports your upgraded core logic

// Helper function to safely escape strings to prevent JSON syntax errors
std::string escapeJSON(const std::string& s) {
    std::string result;
    for (char c : s) {
        if (c == '"') result += "\\\"";
        else if (c == '\\') result += "\\\\";
        else result += c;
    }
    return result;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "{\"status\": \"error\", \"message\": \"No expression provided to engine.\"}\n";
        return 1;
    }

    std::string expression = argv[1];

    try {
        std::vector<StepState> history; // The array to hold our telemetry data
        
        // Pass the history array by reference to collect the snapshots
        std::vector<Token> postfixTokens = infixToPostfix(expression, history);
        double result = evaluatePostfix(postfixTokens);

        // Format the final output queue string
        std::string postfixStr = "";
        for (size_t i = 0; i < postfixTokens.size(); ++i) {
            postfixStr += postfixTokens[i].value;
            if (i < postfixTokens.size() - 1) postfixStr += " ";
        }

        // --- Start building the massive JSON payload ---
        std::cout << "{\n"
                  << "  \"status\": \"success\",\n"
                  << "  \"infix\": \"" << escapeJSON(expression) << "\",\n"
                  << "  \"postfix\": \"" << escapeJSON(postfixStr) << "\",\n"
                  << "  \"result\": " << result << ",\n"
                  << "  \"history\": [\n";

        // Loop through the telemetry data and format it into JSON objects
        for (size_t i = 0; i < history.size(); ++i) {
            const auto& step = history[i];
            std::cout << "    {\n";
            std::cout << "      \"currentToken\": \"" << escapeJSON(step.currentToken.value) << "\",\n";
            
            // Format Stack Snapshot Array
            std::cout << "      \"stackSnapshot\": [";
            for (size_t j = 0; j < step.stackSnapshot.size(); ++j) {
                std::cout << "\"" << escapeJSON(step.stackSnapshot[j].value) << "\"";
                if (j < step.stackSnapshot.size() - 1) std::cout << ", ";
            }
            std::cout << "],\n";

            // Format Queue Snapshot Array
            std::cout << "      \"queueSnapshot\": [";
            for (size_t j = 0; j < step.queueSnapshot.size(); ++j) {
                std::cout << "\"" << escapeJSON(step.queueSnapshot[j].value) << "\"";
                if (j < step.queueSnapshot.size() - 1) std::cout << ", ";
            }
            std::cout << "],\n";

            // Action Description
            std::cout << "      \"actionDescription\": \"" << escapeJSON(step.actionDescription) << "\"\n";

            std::cout << "    }";
            if (i < history.size() - 1) std::cout << ",";
            std::cout << "\n";
        }

        std::cout << "  ]\n}\n";

    } catch (const std::exception& e) {
        std::cerr << "{\"status\": \"error\", \"message\": \"" << escapeJSON(e.what()) << "\"}\n";
        return 1;
    }

    return 0;
}