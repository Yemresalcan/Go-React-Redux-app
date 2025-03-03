package models

import (
	"database/sql"
	"errors"
	"time"
)

// Task represents a task in the system
type Task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	Priority    string    `json:"priority"`
	ProjectID   string    `json:"projectId"`
	AssigneeID  string    `json:"assigneeId,omitempty"`
	DueDate     time.Time `json:"dueDate,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// TaskStore provides methods for interacting with tasks in the database
type TaskStore struct {
	DB *sql.DB
}

// NewTaskStore creates a new TaskStore
func NewTaskStore(db *sql.DB) *TaskStore {
	return &TaskStore{DB: db}
}

// Create creates a new task
func (s *TaskStore) Create(task Task) error {
	query := `
		INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	_, err := s.DB.Exec(
		query,
		task.ID,
		task.Title,
		task.Description,
		task.Status,
		task.Priority,
		task.ProjectID,
		task.AssigneeID,
		task.DueDate,
		task.CreatedAt,
		task.UpdatedAt,
	)
	return err
}

// GetAll gets all tasks
func (s *TaskStore) GetAll() ([]Task, error) {
	query := `
		SELECT id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at
		FROM tasks
		ORDER BY created_at DESC
	`
	rows, err := s.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		var assigneeID sql.NullString
		var dueDate sql.NullTime

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.Priority,
			&task.ProjectID,
			&assigneeID,
			&dueDate,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if assigneeID.Valid {
			task.AssigneeID = assigneeID.String
		}
		if dueDate.Valid {
			task.DueDate = dueDate.Time
		}

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

// GetByID gets a task by ID
func (s *TaskStore) GetByID(id string) (*Task, error) {
	query := `
		SELECT id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at
		FROM tasks
		WHERE id = $1
	`
	row := s.DB.QueryRow(query, id)

	task := &Task{}
	var assigneeID sql.NullString
	var dueDate sql.NullTime

	err := row.Scan(
		&task.ID,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.Priority,
		&task.ProjectID,
		&assigneeID,
		&dueDate,
		&task.CreatedAt,
		&task.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("task not found")
		}
		return nil, err
	}

	if assigneeID.Valid {
		task.AssigneeID = assigneeID.String
	}
	if dueDate.Valid {
		task.DueDate = dueDate.Time
	}

	return task, nil
}

// GetByProject gets all tasks for a project
func (s *TaskStore) GetByProject(projectID string) ([]Task, error) {
	query := `
		SELECT id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at
		FROM tasks
		WHERE project_id = $1
		ORDER BY created_at DESC
	`
	rows, err := s.DB.Query(query, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		var assigneeID sql.NullString
		var dueDate sql.NullTime

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.Priority,
			&task.ProjectID,
			&assigneeID,
			&dueDate,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if assigneeID.Valid {
			task.AssigneeID = assigneeID.String
		}
		if dueDate.Valid {
			task.DueDate = dueDate.Time
		}

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

// GetByAssignee gets all tasks assigned to a user
func (s *TaskStore) GetByAssignee(assigneeID string) ([]*Task, error) {
	query := `
		SELECT id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at
		FROM tasks
		WHERE assignee_id = $1
		ORDER BY created_at DESC
	`
	rows, err := s.DB.Query(query, assigneeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tasks := []*Task{}
	for rows.Next() {
		task := &Task{}
		var dueDate sql.NullTime

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.Priority,
			&task.ProjectID,
			&task.AssigneeID,
			&dueDate,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if dueDate.Valid {
			task.DueDate = dueDate.Time
		}

		tasks = append(tasks, task)
	}
	return tasks, nil
}

// Update updates a task
func (s *TaskStore) Update(task *Task) error {
	query := `
		UPDATE tasks
		SET title = $1, description = $2, status = $3, priority = $4, project_id = $5, assignee_id = $6, due_date = $7, updated_at = $8
		WHERE id = $9
	`
	_, err := s.DB.Exec(
		query,
		task.Title,
		task.Description,
		task.Status,
		task.Priority,
		task.ProjectID,
		task.AssigneeID,
		task.DueDate,
		time.Now(),
		task.ID,
	)
	return err
}

// Delete deletes a task
func (s *TaskStore) Delete(id string) error {
	query := `DELETE FROM tasks WHERE id = $1`
	_, err := s.DB.Exec(query, id)
	return err
}

// DeleteByProject deletes all tasks for a project
func (s *TaskStore) DeleteByProject(projectID string) error {
	query := `DELETE FROM tasks WHERE project_id = $1`
	_, err := s.DB.Exec(query, projectID)
	return err
}

// CreateTables creates the necessary tables for tasks
func (s *TaskStore) CreateTables() error {
	query := `
		CREATE TABLE IF NOT EXISTS tasks (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT,
			status TEXT NOT NULL,
			priority TEXT NOT NULL,
			project_id TEXT NOT NULL,
			assignee_id TEXT,
			due_date TIMESTAMP,
			created_at TIMESTAMP NOT NULL,
			updated_at TIMESTAMP NOT NULL,
			FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
		)
	`
	_, err := s.DB.Exec(query)
	return err
}
