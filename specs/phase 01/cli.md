name: todo-cli
version: 1.0
description: >
  A command-line based Todo application for task management.
  Built using Python with in-memory storage. Enables users to add,
  update, complete, delete and list tasks efficiently.

author: Tabraiz Haider
language: Python
interface: CLI

features:
  - Add new tasks with title and optional description
  - Update existing task’s title or description
  - Mark tasks as completed
  - Delete tasks by ID
  - View all tasks in a clean list format
  - Tasks stored in memory (no database/file persistence)

commands:
  - name: add
    description: Add a new task
    args:
      - name: title
        type: string
        required: true
      - name: description
        type: string
        required: false

  - name: update
    description: Update an existing task by ID
    args:
      - name: id
        type: integer
        required: true
      - name: title
        type: string
        required: false
      - name: description
        type: string
        required: false

  - name: complete
    description: Mark a task as completed by ID
    args:
      - name: id
type: integer
        required: true

  - name: delete
    description: Delete a task by ID
    args:
      - name: id
        type: integer
        required: true

  - name: list
    description: List all tasks with status (completed/pending)

  - name: clear
    description: Clear all tasks from memory (reset app)

notes:
  - This app is for Phase 1 of Hackathon 2
  - Data is not persistent, resets every time the app exits
