package models

import (
	"database/sql"
	"errors"
	"time"
)

// Project represents a project in the system
type Project struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	OwnerID     string    `json:"ownerId"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// ProjectStore handles database operations for projects
type ProjectStore struct {
	DB *sql.DB
}

// NewProjectStore creates a new ProjectStore
func NewProjectStore(db *sql.DB) *ProjectStore {
	return &ProjectStore{DB: db}
}

// CreateTables creates the necessary tables for projects
func (s *ProjectStore) CreateTables() error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	// Create projects table
	projectsQuery := `
	CREATE TABLE IF NOT EXISTS projects (
		id VARCHAR(36) PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		description TEXT,
		status VARCHAR(20) NOT NULL DEFAULT 'active',
		owner_id VARCHAR(36) NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
		FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
	)`

	_, err := s.DB.Exec(projectsQuery)
	if err != nil {
		return err
	}

	return err
}

// Create creates a new project
func (s *ProjectStore) Create(project *Project) error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	query := `
	INSERT INTO projects (id, name, description, status, owner_id, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7)`

	_, err := s.DB.Exec(
		query,
		project.ID,
		project.Name,
		project.Description,
		project.Status,
		project.OwnerID,
		project.CreatedAt,
		project.UpdatedAt,
	)

	return err
}

// GetByID gets a project by ID
func (s *ProjectStore) GetByID(id string) (*Project, error) {
	if s.DB == nil {
		return nil, errors.New("database connection is nil")
	}

	query := `
	SELECT id, name, description, status, owner_id, created_at, updated_at
	FROM projects
	WHERE id = $1`

	project := &Project{}
	err := s.DB.QueryRow(query, id).Scan(
		&project.ID,
		&project.Name,
		&project.Description,
		&project.Status,
		&project.OwnerID,
		&project.CreatedAt,
		&project.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return project, nil
}

// GetAll gets all projects
func (s *ProjectStore) GetAll() ([]*Project, error) {
	if s.DB == nil {
		return nil, errors.New("database connection is nil")
	}

	query := `
	SELECT id, name, description, status, owner_id, created_at, updated_at
	FROM projects
	ORDER BY created_at DESC`

	rows, err := s.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []*Project{}
	for rows.Next() {
		project := &Project{}
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.Description,
			&project.Status,
			&project.OwnerID,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}

	return projects, nil
}

// GetByOwner gets all projects owned by a user
func (s *ProjectStore) GetByOwner(ownerID string) ([]*Project, error) {
	if s.DB == nil {
		return nil, errors.New("database connection is nil")
	}

	query := `
	SELECT id, name, description, status, owner_id, created_at, updated_at
	FROM projects
	WHERE owner_id = $1
	ORDER BY created_at DESC`

	rows, err := s.DB.Query(query, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []*Project{}
	for rows.Next() {
		project := &Project{}
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.Description,
			&project.Status,
			&project.OwnerID,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}

	return projects, nil
}

// GetByUser gets all projects a user has access to
func (s *ProjectStore) GetByUser(userID string) ([]*Project, error) {
	query := `
		SELECT id, name, description, status, owner_id, created_at, updated_at
		FROM projects
		WHERE owner_id = $1
		ORDER BY created_at DESC
	`
	rows, err := s.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := []*Project{}
	for rows.Next() {
		project := &Project{}
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.Description,
			&project.Status,
			&project.OwnerID,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return projects, nil
}

// Update updates a project
func (s *ProjectStore) Update(project *Project) error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	query := `
	UPDATE projects
	SET name = $1, description = $2, status = $3, updated_at = $4
	WHERE id = $5`

	_, err := s.DB.Exec(
		query,
		project.Name,
		project.Description,
		project.Status,
		time.Now(),
		project.ID,
	)

	return err
}

// Delete deletes a project
func (s *ProjectStore) Delete(id string) error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	query := `DELETE FROM projects WHERE id = $1`
	_, err := s.DB.Exec(query, id)
	return err
}
