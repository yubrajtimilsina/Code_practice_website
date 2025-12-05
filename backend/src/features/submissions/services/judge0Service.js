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
    1: 'Accepted',
    2: "Wrong Answer",
    3: "Time Limit Exceeded",
    4: "Compilation Error",
    5: "Runtime Error",
    6: "System Error",
    7: "Error",
    8: "In Queue",
    9: "Processing",
    10: "Rejected",
    11: "Internal Error",
    12: "Exec Format Error",
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
        const response = await axios.post(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, payload, {
            headers,
        });

        if (!response.data || !response.data.token) {
            throw new Error("Invalid response from Judge0 API");
        }

        return response.data.token;
    } catch (error) {
        console.error("Judge0 submission error:", error.message);
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
            isCompilationError: result.status?.id === 4,
            isRuntimeError: result.status?.id === 5,
            isTimeoutError: result.status?.id === 6,
            isProcessing: result.status?.id === 1 || result.status?.id === 2,
        };
    } catch (error) {
        console.error("Judge0 fetch result error:", error.message);
        throw new Error(error.response?.data?.message || error.message || " Failed to fetch result from Judge0")
    }
};

export const pollResult = async (token, maxAttempts = 20, interval = 500) => {
    try {
        for (let i = 0; i < maxAttempts; i++) {
            const result = await fetchResult(token);
            if (!result.isProcessing) {
                return result;
            }

            await new Promise(resolve => setTimeout(resolve, interval));
        }
        throw new Error("Execution time out. Please try again.");
    } catch (error) {
        console.error("Judge0 pool result error:", error.message);
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

