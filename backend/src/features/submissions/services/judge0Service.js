import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST;

const LANGUAGE_IDS = {
    javascript: 63,
    python: 71,
    java: 62,
    'c++': 54,
    c: 50,
    typescript: 74,
    csharp: 51,
    go: 60,
};

const VERDICTS = {
    1: 'In Queue',
    2: 'Processing',
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error (SIGSEGV)',
    8: 'Runtime Error (SIGXFSZ)',
    9: 'Runtime Error (SIGFPE)',
    10: 'Runtime Error (SIGABRT)',
    11: 'Runtime Error (NZEC)',
    12: 'Runtime Error (Other)',
    13: 'Internal Error',
    14: 'Exec Format Error',
};

export const submitToJudge0 = async (code, languageKey, input = '', expectedOutput = '') => {
    try {
        if (!JUDGE0_API_KEY) {
            throw new Error('Judge0 API key is not defined in environment variables.');
        }

        const languageId = LANGUAGE_IDS[languageKey];
        if (!languageId) {
            throw new Error(`Language ${languageKey} is not supported.`);
        }

        console.log('Submitting to Judge0:', {
            language: languageKey,
            languageId,
            codeLength: code.length,
            inputLength: input.length,
            expectedOutputLength: expectedOutput.length
        });

        const payload = {
            language_id: languageId,
            source_code: code,
            stdin: input,
            expected_output: expectedOutput,
        };

        const headers = {
            'content-type': 'application/json',
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': JUDGE0_HOST,
        };

        const response = await axios.post(
            `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, 
            payload,
            { headers }
        );

        console.log('Judge0 submission created:', response.data);

        if (!response.data || !response.data.token) {
            throw new Error("Invalid response from Judge0 API");
        }

        return response.data.token;
    } catch (error) {
        console.error("Judge0 submission error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.message || error.message || "Failed to submit code to Judge0");
    }
};

export const fetchResult = async (token) => {
    try {
        if (!JUDGE0_API_KEY) {
            throw new Error("Judge0 API key is not defined in environment variables.");
        }

        if (!token) {
            throw new Error("Token is required to fetch the result.");
        }

        const headers = {
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': JUDGE0_HOST,
        };

        const response = await axios.get(
            `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`,
            { headers }
        );

        const result = response.data;

        console.log('Judge0 result:', {
            token,
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            message: result.message
        });

        return {
            token,
            status: result.status?.id || 0,
            statusText: result.status?.description || 'Unknown',
            verdict: VERDICTS[result.status?.id] || "Unknown",
            output: result.stdout || "",
            stderr: result.stderr || "",
            compilationError: result.compile_output || "",
            expectedOutput: result.expected_output || "",
            executionTime: result.time ? `${(parseFloat(result.time) * 1000).toFixed(2)}ms` : "0ms",
            memoryUsed: result.memory ? `${result.memory}KB` : "0KB",
            isAccepted: result.status?.id === 3,
            isCompilationError: result.status?.id === 6,
            isRuntimeError: [5, 7, 8, 9, 10, 11, 12].includes(result.status?.id),
            isTimeoutError: result.status?.id === 5,
            isProcessing: result.status?.id === 1 || result.status?.id === 2,
        };
    } catch (error) {
        console.error("Judge0 fetch result error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch result from Judge0");
    }
};

export const pollResult = async (token, maxAttempts = 20, interval = 500) => {
    try {
        console.log(` Polling Judge0 result for token: ${token}`);
        
        for (let i = 0; i < maxAttempts; i++) {
            const result = await fetchResult(token);
            
            console.log(`Attempt ${i + 1}/${maxAttempts}:`, {
                status: result.statusText,
                verdict: result.verdict,
                isProcessing: result.isProcessing
            });
            
            if (!result.isProcessing) {
                console.log(' Final result:', result);
                return result;
            }

            await new Promise(resolve => setTimeout(resolve, interval));
        }
        throw new Error("Execution timeout. Please try again.");
    } catch (error) {
        console.error("Judge0 poll result error:", error.message);
        throw error;
    }
};

export const getAvailableLanguages = () => {
    return Object.entries(LANGUAGE_IDS).map(([name, id]) => ({
        name,
        id,
        displayName: capitalizeFirst(name),
    }));
};

const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};