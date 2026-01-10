# Specification: Phase 3 - AI-Powered Multilingual Todo Chatbot

## 1. Project Context
Upgrading the existing Todo Web App (FastAPI + Next.js + Neon DB) into an AI-native system where users can manage tasks via a chat interface using Natural Language (English and Roman Urdu).

## 2. Core Functional Requirements

### A. AI Agent Capabilities
- **Natural Language Understanding (NLU)**: Must understand commands in English and Roman Urdu (e.g., "Kal meeting add karo", "Aaj ke tasks dikhao", "Pehla task delete kar do").
- **Bilingual Responses**: Respond in the same language style as the user (Code-switching support).
- **Tool Calling (Function Calling)**: The AI must map user intent to these specific tools:
    - `add_task(title, priority, due_date)`
    - `list_tasks()`
    - `delete_task(task_id)`
    - `update_task(task_id, status)`

### B. Backend Architecture (FastAPI)
- **Endpoint**: `POST /api/ai/chat`.
- **AI Model**: OpenAI (gpt-4o or gpt-3.5-turbo) or Anthropic Claude.
- **Context Management**: 
    - AI must receive the current user's task list as context to answer questions.
    - Token-based Authentication (JWT) must protect the endpoint.
- **History Persistence**: Store chat messages in the `chat_history` table in Neon PostgreSQL.

### C. Frontend Interface (Next.js)
- **UI Component**: A modern, floating chat drawer or sidebar (using shadcn/ui).
- **UX Features**:
    - Typing indicators (AI is thinking...).
    - Auto-scroll to latest message.
    - Quick action buttons (e.g., "Show today's tasks").
- **Glassmorphism UI**: Match the premium design of the main app.

## 3. Technical Specs & Constraints
- **Language**: Python (Backend), TypeScript/React (Frontend).
- **Spec-Driven Implementation**: Use Claude Code to generate logic based on these specs.
- **Prompt Engineering**: System prompt must instruct the AI to be a "Todo Assistant" that prefers tool-calling over plain text for task-related queries.

## 4. Success Scenarios
1. **Scenario 1**: User types "Meeting add karo sham 5 baje". AI calls `add_task` and replies in Roman Urdu: "Theek hai, sham 5 baje ki meeting add kar di gayi hai."
2. **Scenario 2**: User asks "Mere kitne tasks baaki hain?". AI calls `list_tasks`, counts them, and responds.