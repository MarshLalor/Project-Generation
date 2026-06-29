export function buildFollowUpFirstPrompt({
  sectionName = "Current Section",
  basePrompt = "",
}) {
  return `You are helping build the "${sectionName}" section of a larger project/business case workflow.

Important interaction mode:
1. First, review all available context from previous sections.
2. Before generating the full final output, identify any missing or unclear information.
3. Ask the user focused follow-up questions that would improve the quality of the ${sectionName} output.
4. Do not generate the full final output immediately unless the user explicitly says:
   - "Proceed with current assumptions"
   - "Generate the full output now"
   - "Use assumptions and continue"
5. If the user chooses to proceed without answering all questions, clearly list the assumptions used.
6. Once the user answers the follow-up questions or asks you to proceed, generate the full output using the requested structure from the prompt below.

Your output for the first response should be:

A. Context Review
B. Missing or Unclear Information
C. Follow-Up Questions
D. Recommended Assumptions if the User Wants to Proceed
E. Next Step Instruction

After the user responds, generate the full requested output structure.

Base prompt and source context:
${basePrompt}`;
}