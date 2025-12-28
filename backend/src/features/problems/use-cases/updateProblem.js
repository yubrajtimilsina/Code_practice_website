import { updateProblemById } from "../repository/problemRepository.js";

export const updateProblemUseCase = async (id, updates) => {
    
    //  CRITICAL: Preserve all array fields during update
    const updateData = {
        ...updates,
        
        // Ensure arrays are properly handled
        examples: updates.examples || [],
        constraints: updates.constraints || [],
        hints: updates.hints || [],
        testCases: updates.testCases || [],
        tags: updates.tags || [],
        
        // Update timestamp
        updatedAt: Date.now()
    };
    
    const updated = await updateProblemById(id, updateData);
    
    
    return updated;
};