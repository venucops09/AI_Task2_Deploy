# Reflection Report

## Challenges
- **Data Shape Consistency:**
  - Challenge: Ensuring the frontend and backend agreed on data formats (e.g., paginated vs. array responses).
  - Solution: Manual review and adjustment of API responses and frontend data handling. AI helped spot and fix mismatches quickly.

- **Authentication & Authorization:**
  - Challenge: Integrating JWT authentication and role-based access, and debugging token storage/usage in the frontend.
  - Solution: AI provided scaffolding for JWT logic and middleware, but required manual debugging for token propagation.

- **Contact History Integration:**
  - Challenge: Displaying per-customer interaction history in a user-friendly way.
  - Solution: AI suggested a dialog-based UI and backend filtering, which was implemented with minimal changes.

- **Task Reminders:**
  - Challenge: Implementing both backend (cron job) and frontend (in-app) reminders for upcoming tasks.
  - Solution: AI generated node-cron jobs and React notification logic, making the process fast and reliable.

## Learnings
- **Prompt Engineering:**
  - Clear, specific prompts yield the best results. Iterative refinement is key for complex features.
- **AI as a Pair Programmer:**
  - AI can rapidly scaffold full-stack features, but human review is essential for business logic and UX.
- **Manual Validation:**
  - Always test AI-generated code, especially for edge cases and integration points.
- **Documentation:**
  - Using AI for both code and documentation accelerates onboarding and knowledge sharing.

## AI Effectiveness
- **Cursor:**
  - *Effectiveness*: 10/10. Handled full-stack scaffolding, iterative changes, and documentation with high accuracy.
  - *Best Use*: End-to-end feature generation, refactoring, and documentation.
- **GitHub Copilot:**
  - *Effectiveness*: 8/10. Great for inline code suggestions and boilerplate, but less effective for complex business logic.
- **AWS Q Developer:**
  - *Effectiveness*: 7/10. Useful for security scanning and optimization, but required manual review for some suggestions.

## Most Valuable AI Techniques
- Iterative prompt refinement for complex workflows.
- Using AI to generate both code and documentation.
- Combining multiple AI tools for complementary strengths.

## What Would I Do Differently?
- Integrate AI-driven test generation and code review earlier in the process.
- Use AI to scaffold more advanced analytics and reporting features.
- Automate more of the deployment and CI/CD pipeline with AI assistance.

## Key Takeaways
- AI can dramatically accelerate full-stack development, but human oversight is essential for quality and business fit.
- The combination of prompt engineering, manual validation, and tool orchestration delivers the best results. 