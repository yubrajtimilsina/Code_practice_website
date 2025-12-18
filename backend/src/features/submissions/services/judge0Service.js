import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358';
const JUDGE0_AUTH_TOKEN = process.env.JUDGE0_AUTH_TOKEN;

// CRITICAL FIX: Verify token matches docker-compose.yml
console.log(' Judge0 Config:', {
    url: JUDGE0_API_URL,
    hasToken: !!JUDGE0_AUTH_TOKEN,
    tokenPreview: JUDGE0_AUTH_TOKEN ? JUDGE0_AUTH_TOKEN.substring(0, 10) + '...' : 'MISSING'
});

const LANGUAGE_IDS = {
    javascript: 63,  // Node.js
    python: 71,      // Python 3
    java: 62,        // Java
    'c++': 54,       // C++ (GCC 9.2.0)
    c: 50,           // C (GCC 9.2.0)
    typescript: 74,  // TypeScript
    csharp: 51,      // C#
    go: 60,          // Go
    ruby: 72,        // Ruby
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

const normalizeVerdict = (statusId) => {
    const verdict = VERDICTS[statusId] || 'System Error';
    if (verdict.startsWith('Runtime Error')) {
        return 'Runtime Error';
    }
    return verdict;
};

const encodeBase64 = (str) => {
    return Buffer.from(str || '', 'utf-8').toString('base64');
};

const decodeBase64 = (str) => {
    if (!str) return '';
    try {
        return Buffer.from(str, 'base64').toString('utf-8');
    } catch (e) {
        console.error(' Base64 decode error:', e);
        return str;
    }
};

// CRITICAL FIX: Validate inputs before submission
const validateSubmission = (code, languageKey, input, expectedOutput) => {
    if (!code || code.trim().length === 0) {
        throw new Error('Code cannot be empty');
    }
    
    if (!languageKey || !LANGUAGE_IDS[languageKey]) {
        throw new Error(`Unsupported language: ${languageKey}`);
    }
    
    if (code.length > 65536) { // 64KB limit
        throw new Error('Code is too long (max 64KB)');
    }
    
    if (input && input.length > 65536) {
        throw new Error('Input is too long (max 64KB)');
    }
    
    return true;
};

export const submitToJudge0 = async (code, languageKey, input = '', expectedOutput = '') => {
    try {
        // CRITICAL: Validate before sending
        validateSubmission(code, languageKey, input, expectedOutput);
        
        const languageId = LANGUAGE_IDS[languageKey];
        if (!languageId) {
            throw new Error(`Language ${languageKey} is not supported.`);
        }

        console.log(' Submitting to Judge0:', {
            language: languageKey,
            languageId,
            codeLength: code.length,
            inputLength: input.length,
            expectedOutputLength: expectedOutput.length,
            url: JUDGE0_API_URL,
        });

        // CRITICAL FIX: Increased limits to match docker-compose
        const payload = {
            language_id: languageId,
            source_code: encodeBase64(code),
            stdin: encodeBase64(input),
            expected_output: encodeBase64(expectedOutput),
            cpu_time_limit: 5,        // Match docker-compose
            cpu_extra_time: 2,         // Match docker-compose
            wall_time_limit: 10,       // Match docker-compose
            memory_limit: 256000,      // 256 MB - INCREASED
            stack_limit: 64000,        // 64 MB - INCREASED
            max_processes_and_or_threads: 60,  // INCREASED
            enable_per_process_and_thread_time_limit: true,
            enable_per_process_and_thread_memory_limit: true,
            max_file_size: 2048,       // 2 MB
            enable_network: false,
        };

        const headers = {
            'content-type': 'application/json',
        };

        // CRITICAL: Add auth token
        if (JUDGE0_AUTH_TOKEN) {
            headers['X-Auth-Token'] = JUDGE0_AUTH_TOKEN;
        } else {
            console.warn('  WARNING: No Judge0 auth token set!');
        }

        console.log(' Payload:', {
            language_id: payload.language_id,
            source_code_length: payload.source_code.length,
            stdin_length: payload.stdin.length,
            expected_output_length: payload.expected_output.length,
        });

        const response = await axios.post(
            `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`,
            payload,
            { 
                headers,
                timeout: 15000, // INCREASED timeout
                validateStatus: (status) => status < 500, // Don't throw on 4xx
            }
        );

        console.log(' Judge0 response:', {
            status: response.status,
            data: response.data,
        });

        // CRITICAL: Handle 422 errors
        if (response.status === 422) {
            console.error(' Judge0 422 Error:', response.data);
            throw new Error(`Validation Error: ${JSON.stringify(response.data)}`);
        }

        if (!response.data || !response.data.token) {
            throw new Error("Invalid response from Judge0 API - no token returned");
        }

        return response.data.token;
    } catch (error) {
        console.error(" Judge0 submission error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            code: error.code,
        });

        // CRITICAL: Better error messages
        if (error.code === 'ECONNREFUSED') {
            throw new Error("Cannot connect to Judge0 server. Make sure Docker containers are running: docker-compose up -d");
        }
        
        if (error.response?.status === 401) {
            throw new Error("Judge0 authentication failed. Check your JUDGE0_AUTH_TOKEN in .env matches docker-compose.yml");
        }
        
        if (error.response?.status === 422) {
            const details = error.response.data;
            throw new Error(`Judge0 validation error: ${JSON.stringify(details)}`);
        }
        
        if (error.response?.status === 429) {
            throw new Error("Too many requests to Judge0. Please wait a moment and try again.");
        }

        throw new Error(error.response?.data?.message || error.message || "Failed to submit code to Judge0");
    }
};

export const fetchResult = async (token) => {
    try {
        if (!token) {
            throw new Error("Token is required to fetch the result.");
        }

        const headers = {
            'content-type': 'application/json',
        };

        if (JUDGE0_AUTH_TOKEN) {
            headers['X-Auth-Token'] = JUDGE0_AUTH_TOKEN;
        }

        const response = await axios.get(
            `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true&fields=*`,
            { 
                headers,
                timeout: 10000,
                validateStatus: (status) => status < 500,
            }
        );

        // CRITICAL: Handle errors
        if (response.status === 404) {
            throw new Error('Submission not found');
        }

        const result = response.data;

        console.log(' Judge0 result:', {
            token,
            status: result.status,
            statusId: result.status?.id,
            verdict: VERDICTS[result.status?.id],
        });

        const actualOutput = decodeBase64(result.stdout || "").trim();
        const expectedOutput = decodeBase64(result.expected_output || "").trim();
        const stderr = decodeBase64(result.stderr || "");
        const compileOutput = decodeBase64(result.compile_output || "");
        
        const isCorrectOutput = actualOutput === expectedOutput;
        const isJudge0Accepted = result.status?.id === 3;
        const isAccepted = isJudge0Accepted && isCorrectOutput;

        return {
            token,
            status: result.status?.id || 0,
            statusText: result.status?.description || 'Unknown',
            verdict: normalizeVerdict(result.status?.id),
            output: actualOutput,
            stderr: stderr,
            compilationError: compileOutput,
            expectedOutput: expectedOutput,
            executionTime: result.time ? `${(parseFloat(result.time) * 1000).toFixed(2)}ms` : "0ms",
            memoryUsed: result.memory ? `${result.memory}KB` : "0KB",
            isAccepted: isAccepted,
            isCompilationError: result.status?.id === 6,
            isRuntimeError: [7, 8, 9, 10, 11, 12].includes(result.status?.id),
            isTimeoutError: result.status?.id === 5,
            isProcessing: result.status?.id === 1 || result.status?.id === 2,
            isWrongAnswer: result.status?.id === 4 || (!isAccepted && isJudge0Accepted),
        };
    } catch (error) {
        console.error(" Judge0 fetch result error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        if (error.code === 'ECONNREFUSED') {
            throw new Error("Cannot connect to Judge0 server. Make sure Docker containers are running.");
        }

        throw new Error(error.response?.data?.error || error.message || "Failed to fetch result from Judge0");
    }
};

export const pollResult = async (token, maxAttempts = 60, interval = 1000) => {
    try {
        console.log(` Polling Judge0 result for token: ${token}`);

        for (let i = 0; i < maxAttempts; i++) {
            const result = await fetchResult(token);

            console.log(` Attempt ${i + 1}/${maxAttempts}:`, {
                status: result.statusText,
                verdict: result.verdict,
                isProcessing: result.isProcessing
            });

            if (!result.isProcessing) {
                console.log(' Final result:', {
                    verdict: result.verdict,
                    isAccepted: result.isAccepted,
                    executionTime: result.executionTime,
                    memoryUsed: result.memoryUsed,
                });
                return result;
            }

            // Exponential backoff
            const waitTime = i < 10 ? interval : Math.min(interval * 1.5, 3000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        throw new Error("Execution timeout. The code is taking too long to execute.");
    } catch (error) {
        console.error(" Judge0 poll result error:", error.message);
        throw error;
    }
};

export const testJudge0Connection = async () => {
    try {
        const headers = {};
        if (JUDGE0_AUTH_TOKEN) {
            headers['X-Auth-Token'] = JUDGE0_AUTH_TOKEN;
        }

        const response = await axios.get(
            `${JUDGE0_API_URL}/about`,
            { 
                headers, 
                timeout: 5000,
                validateStatus: (status) => status < 500,
            }
        );

        console.log(' Judge0 connection successful:', response.data);
        return {
            success: true,
            version: response.data?.version || 'unknown',
            data: response.data
        };
    } catch (error) {
        console.error(' Judge0 connection failed:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
        });
        return {
            success: false,
            error: error.message
        };
    }
};

export const getAvailableLanguages = () => {
    return Object.entries(LANGUAGE_IDS).map(([name, id]) => ({
        name,
        id,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
    }));
};