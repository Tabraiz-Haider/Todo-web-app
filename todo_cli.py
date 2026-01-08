#!/usr/bin/env python3
"""
Todo CLI Application
Version: 1.0
Author: Tabraiz Haider
Description: A command-line based Todo application for task management.
"""

import sys
from typing import List, Dict, Optional


class Task:
    """Represents a single task with id, title, description and completion status."""

    def __init__(self, task_id: int, title: str, description: str = ""):
        self.id = task_id
        self.title = title
        self.description = description
        self.completed = False

    def __str__(self) -> str:
        status = "✓" if self.completed else "✗"
        desc_text = f"\n  Description: {self.description}" if self.description else ""
        return f"[{status}] ID: {self.id} - {self.title}{desc_text}"


class TodoCLI:
    """Main Todo CLI application class."""

    def __init__(self):
        self.tasks: Dict[int, Task] = {}
        self.next_id = 1

    def add_task(self, title: str, description: str = "") -> None:
        """Add a new task to the list."""
        if not title or not title.strip():
            print("Error: Task title cannot be empty.")
            return

        task = Task(self.next_id, title.strip(), description.strip())
        self.tasks[self.next_id] = task
        print(f"Task added successfully! (ID: {self.next_id})")
        self.next_id += 1

    def update_task(self, task_id: int, title: Optional[str] = None,
                    description: Optional[str] = None) -> None:
        """Update an existing task by ID."""
        if task_id not in self.tasks:
            print(f"Error: Task with ID {task_id} not found.")
            return

        if title is None and description is None:
            print("Error: Please provide at least title or description to update.")
            return

        task = self.tasks[task_id]

        if title is not None:
            if not title.strip():
                print("Error: Task title cannot be empty.")
                return
            task.title = title.strip()

        if description is not None:
            task.description = description.strip()

        print(f"Task {task_id} updated successfully!")

    def complete_task(self, task_id: int) -> None:
        """Mark a task as completed by ID."""
        if task_id not in self.tasks:
            print(f"Error: Task with ID {task_id} not found.")
            return

        task = self.tasks[task_id]
        if task.completed:
            print(f"Task {task_id} is already completed.")
        else:
            task.completed = True
            print(f"Task {task_id} marked as completed!")

    def delete_task(self, task_id: int) -> None:
        """Delete a task by ID."""
        if task_id not in self.tasks:
            print(f"Error: Task with ID {task_id} not found.")
            return

        del self.tasks[task_id]
        print(f"Task {task_id} deleted successfully!")

    def list_tasks(self) -> None:
        """List all tasks with their status."""
        if not self.tasks:
            print("No tasks found. Add a task to get started!")
            return

        print("\n" + "=" * 60)
        print("TODO LIST")
        print("=" * 60)

        for task_id in sorted(self.tasks.keys()):
            print(self.tasks[task_id])
            print("-" * 60)

        completed = sum(1 for task in self.tasks.values() if task.completed)
        total = len(self.tasks)
        print(f"\nTotal: {total} task(s) | Completed: {completed} | Pending: {total - completed}")
        print()

    def clear_tasks(self) -> None:
        """Clear all tasks from memory."""
        if not self.tasks:
            print("No tasks to clear.")
            return

        confirm = input("Are you sure you want to clear all tasks? (yes/no): ").strip().lower()
        if confirm in ['yes', 'y']:
            self.tasks.clear()
            self.next_id = 1
            print("All tasks cleared successfully!")
        else:
            print("Clear operation cancelled.")

    def print_help(self) -> None:
        """Print help information about available commands."""
        help_text = """
Todo CLI - Task Management Application

COMMANDS:
  add <title> [description]     Add a new task
  update <id> [title] [desc]    Update an existing task
  complete <id>                 Mark a task as completed
  delete <id>                   Delete a task
  list                          List all tasks
  clear                         Clear all tasks
  help                          Show this help message
  exit/quit                     Exit the application

EXAMPLES:
  > add "Buy groceries" "Milk, eggs, bread"
  > update 1 "Buy groceries tomorrow"
  > complete 1
  > delete 1
  > list
  > clear

Note: Data is stored in memory and will be lost when the app exits.
"""
        print(help_text)

    def run(self) -> None:
        """Main application loop."""
        print("\n" + "=" * 60)
        print("Welcome to Todo CLI v1.0")
        print("=" * 60)
        print("Type 'help' for available commands or 'exit' to quit.\n")

        while True:
            try:
                user_input = input("> ").strip()

                if not user_input:
                    continue

                parts = self.parse_input(user_input)
                if not parts:
                    continue

                command = parts[0].lower()
                args = parts[1:]

                if command in ['exit', 'quit']:
                    print("Thank you for using Todo CLI. Goodbye!")
                    break
                elif command == 'help':
                    self.print_help()
                elif command == 'add':
                    self.handle_add(args)
                elif command == 'update':
                    self.handle_update(args)
                elif command == 'complete':
                    self.handle_complete(args)
                elif command == 'delete':
                    self.handle_delete(args)
                elif command == 'list':
                    self.list_tasks()
                elif command == 'clear':
                    self.clear_tasks()
                else:
                    print(f"Unknown command: '{command}'. Type 'help' for available commands.")

            except KeyboardInterrupt:
                print("\n\nExiting Todo CLI. Goodbye!")
                break
            except Exception as e:
                print(f"An error occurred: {e}")

    def parse_input(self, user_input: str) -> List[str]:
        """Parse user input handling quoted strings."""
        parts = []
        current = ""
        in_quotes = False
        quote_char = None

        for char in user_input:
            if char in ['"', "'"] and not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char and in_quotes:
                in_quotes = False
                quote_char = None
                if current:
                    parts.append(current)
                    current = ""
            elif char == ' ' and not in_quotes:
                if current:
                    parts.append(current)
                    current = ""
            else:
                current += char

        if current:
            parts.append(current)

        return parts

    def handle_add(self, args: List[str]) -> None:
        """Handle the add command."""
        if not args:
            print("Error: Title is required. Usage: add <title> [description]")
            return

        title = args[0]
        description = args[1] if len(args) > 1 else ""
        self.add_task(title, description)

    def handle_update(self, args: List[str]) -> None:
        """Handle the update command."""
        if not args:
            print("Error: Task ID is required. Usage: update <id> [title] [description]")
            return

        try:
            task_id = int(args[0])
        except ValueError:
            print("Error: Task ID must be a number.")
            return

        title = args[1] if len(args) > 1 else None
        description = args[2] if len(args) > 2 else None
        self.update_task(task_id, title, description)

    def handle_complete(self, args: List[str]) -> None:
        """Handle the complete command."""
        if not args:
            print("Error: Task ID is required. Usage: complete <id>")
            return

        try:
            task_id = int(args[0])
        except ValueError:
            print("Error: Task ID must be a number.")
            return

        self.complete_task(task_id)

    def handle_delete(self, args: List[str]) -> None:
        """Handle the delete command."""
        if not args:
            print("Error: Task ID is required. Usage: delete <id>")
            return

        try:
            task_id = int(args[0])
        except ValueError:
            print("Error: Task ID must be a number.")
            return

        self.delete_task(task_id)


def main():
    """Entry point for the Todo CLI application."""
    app = TodoCLI()
    app.run()


if __name__ == "__main__":
    main()
