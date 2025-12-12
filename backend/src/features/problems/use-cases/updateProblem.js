import { updateProblemById } from "../repository/problemRepository.js";

export const updateProblemUseCase = async (id, updates) => {
    console.log("Updating problem:", id);
    console.log("Updates received:", {
        title: updates.title,
        examplesCount: updates.examples?.length || 0,
        constraintsCount: updates.constraints?.length || 0,
        testCasesCount: updates.testCases?.length || 0,
        hintsCount: updates.hints?.length || 0
    });
    
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
    
    if (updated) {
        console.log(" Problem updated successfully");
    }
    
    return updated;
};