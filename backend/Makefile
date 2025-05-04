.PHONY: all install format test run deploy help migrate migrate-create migrate-up migrate-down

all: help

install:
	@echo "Installing project dependencies..."
	@pip install -r requirements.txt

format:
	@echo "Formatting Python files..."
	@git ls-files '*.py' | xargs -I {} sh -c 'ruff check --fix "{}" && black "{}" && isort "{}" --profile black'

lint:
	@echo "Linting Python files..."
	@git ls-files '*.py' | xargs -n 1 -I {} ruff check {}
	@git ls-files '*.py' | xargs -n 1 -I {} pylint {}

test:
	@echo "Running tests..."
	@pytest

run:
	@echo "Running Baiyit backend..."
	@docker compose up -d
	@docker compose logs api -f

migrate-create:
	@echo "Creating a new migration..."
	@alembic revision --autogenerate -m "$(message)"

migrate-up:
	@echo "Upgrading database to latest version..."
	@alembic upgrade head

migrate-down:
	@echo "Downgrading database by one version..."
	@alembic downgrade -1

migrate:
	@echo "Migration commands available:"
	@echo "  make migrate-create - Create a new migration"
	@echo "  make migrate-up    - Apply all pending migrations"
	@echo "  make migrate-down  - Rollback the most recent migration"

help:
	@echo "Baiyit Makefile"
	@echo "----------------------"
	@echo "Available commands:"
	@echo "  install       - Install dependencies"
	@echo "  format        - Format Python code"
	@echo "  lint          - Lint Python code"
	@echo "  test          - Run tests"
	@echo "  run           - Run the application"
	@echo "  migrate-create - Create a new migration (usage: make migrate-create message='description')"
	@echo "  migrate-up    - Apply all pending migrations"
	@echo "  migrate-down  - Rollback the most recent migration"
	@echo "  migrate       - Show migration commands"
	@echo "  help          - Show this help message"