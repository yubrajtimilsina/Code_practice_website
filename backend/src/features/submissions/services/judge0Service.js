import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358';
const JUDGE0_AUTH_TOKEN = process.env.JUDGE0_AUTH_TOKEN;

const LANGUAGE_IDS = {
    javascript: 63,
    python: 71,
    java: 62,
    'c++': 54,
    c: 50,
    typescript: 74,
    csharp: 51,
    go: 60,
    ruby: 72,
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
        console.error('Base64 decode error:', e);
        return str;
    }
};

export const submitToJudge0 = async (code, languageKey, input = '', expectedOutput = '') => {
    try {
        const languageId = LANGUAGE_IDS[languageKey];
        if (!languageId) {
            throw new Error(`Language ${languageKey} is not supported.`);
        }

        console.log('📤 Submitting to Judge0:', {
            language: languageKey,
            languageId,
            codeLength: code.length,
            inputLength: input.length,
            expectedOutputLength: expectedOutput.length,
        });

        // ENHANCED: Better resource limits to prevent timeouts
        const payload = {
            language_id: languageId,
            source_code: encodeBase64(code),
            stdin: encodeBase64(input),
            expected_output: encodeBase64(expectedOutput),
            cpu_time_limit: 3, // Reduced from 5 to 3 seconds
            cpu_extra_time: 1, // Extra buffer time
            wall_time_limit: 5, // Reduced from 10 to 5 seconds
            memory_limit: 128000, // 128 MB
            stack_limit: 64000, // 64 MB
            max_processes_and_or_threads: 30,
            enable_per_process_and_thread_time_limit: true,
            enable_per_process_and_thread_memory_limit: true,
            max_file_size: 1024,
            enable_network: false,
        };

        const headers = {
            'content-type': 'application/json',
        };

        if (JUDGE0_AUTH_TOKEN) {
            headers['X-Auth-Token'] = JUDGE0_AUTH_TOKEN;
        }

        const response = await axios.post(
            `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`,
            payload,
            { 
                headers,
                timeout: 10000
            }
        );

        console.log('✅ Judge0 submission created:', response.data);

        if (!response.data || !response.data.token) {
            throw new Error("Invalid response from Judge0 API");
        }

        return response.data.token;
    } catch (error) {
        console.error("❌ Judge0 submission error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });

        if (error.code === 'ECONNREFUSED') {
            throw new Error("Cannot connect to Judge0 server. Make sure Docker containers are running.");
        }
        if (error.response?.status === 401) {
            throw new Error("Judge0 authentication failed. Check your auth token.");
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
                timeout: 5000 
            }
        );

        const result = response.data;

        console.log('📊 Judge0 result:', {
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
        console.error("❌ Judge0 fetch result error:", {
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

export const pollResult = async (token, maxAttempts = 40, interval = 500) => {
    try {
        console.log(`⏳ Polling Judge0 result for token: ${token}`);

        for (let i = 0; i < maxAttempts; i++) {
            const result = await fetchResult(token);

            console.log(`🔄 Attempt ${i + 1}/${maxAttempts}:`, {
                status: result.statusText,
                verdict: result.verdict,
                isProcessing: result.isProcessing
            });

            if (!result.isProcessing) {
                console.log('✅ Final result:', {
                    verdict: result.verdict,
                    isAccepted: result.isAccepted,
                    executionTime: result.executionTime,
                    memoryUsed: result.memoryUsed,
                });
                return result;
            }

            // Exponential backoff for longer running submissions
            const waitTime = i < 10 ? interval : interval * 1.5;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        throw new Error("Execution timeout. The code is taking too long to execute.");
    } catch (error) {
        console.error("❌ Judge0 poll result error:", error.message);
        throw error;
    }
};

export const getAvailableLanguages = () => {
    return Object.entries(LANGUAGE_IDS).map(([name, id]) => ({
        name,
        id,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
    }));
};

export const testJudge0Connection = async () => {
    try {
        const headers = {};
        if (JUDGE0_AUTH_TOKEN) {
            headers['X-Auth-Token'] = JUDGE0_AUTH_TOKEN;
        }

        const response = await axios.get(
            `${JUDGE0_API_URL}/about`,
            { headers, timeout: 5000 }
        );

        console.log('✅ Judge0 connection successful:', response.data);
        return {
            success: true,
            version: response.data?.version || 'unknown',
            data: response.data
        };
    } catch (error) {
        console.error('❌ Judge0 connection failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

export const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};