package models

import (
	"database/sql"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// User represents a user in the system
type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // Password is never sent to client
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// UserStore handles database operations for users
type UserStore struct {
	DB *sql.DB
}

// NewUserStore creates a new UserStore
func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{DB: db}
}

// CreateTables creates the necessary tables for users
func (s *UserStore) CreateTables() error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	query := `
	CREATE TABLE IF NOT EXISTS users (
		id VARCHAR(36) PRIMARY KEY,
		username VARCHAR(50) UNIQUE NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		password VARCHAR(100) NOT NULL,
		first_name VARCHAR(50),
		last_name VARCHAR(50),
		role VARCHAR(20) NOT NULL DEFAULT 'user',
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW()
	)`

	_, err := s.DB.Exec(query)
	return err
}

// Create creates a new user
func (s *UserStore) Create(user *User) error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	query := `
	INSERT INTO users (id, username, email, password, first_name, last_name, role, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	_, err = s.DB.Exec(
		query,
		user.ID,
		user.Username,
		user.Email,
		string(hashedPassword),
		user.FirstName,
		user.LastName,
		user.Role,
		user.CreatedAt,
		user.UpdatedAt,
	)

	return err
}

// GetByID gets a user by ID
func (s *UserStore) GetByID(id string) (*User, error) {
	if s.DB == nil {
		return nil, errors.New("database connection is nil")
	}

	query := `
	SELECT id, username, email, password, first_name, last_name, role, created_at, updated_at
	FROM users
	WHERE id = $1`

	user := &User{}
	err := s.DB.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

// GetByUsername gets a user by username
func (s *UserStore) GetByUsername(username string) (*User, error) {
	if s.DB == nil {
		return nil, errors.New("database connection is nil")
	}

	query := `
	SELECT id, username, email, password, first_name, last_name, role, created_at, updated_at
	FROM users
	WHERE username = $1`

	user := &User{}
	err := s.DB.QueryRow(query, username).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

// Update updates a user
func (s *UserStore) Update(user *User) error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	query := `
	UPDATE users
	SET username = $1, email = $2, first_name = $3, last_name = $4, role = $5, updated_at = $6
	WHERE id = $7`

	_, err := s.DB.Exec(
		query,
		user.Username,
		user.Email,
		user.FirstName,
		user.LastName,
		user.Role,
		time.Now(),
		user.ID,
	)

	return err
}

// Delete deletes a user
func (s *UserStore) Delete(id string) error {
	if s.DB == nil {
		return errors.New("database connection is nil")
	}

	query := `DELETE FROM users WHERE id = $1`
	_, err := s.DB.Exec(query, id)
	return err
}

// CheckPassword checks if the provided password matches the stored hash
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// SetPassword sets a new password for the user
func (u *User) SetPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}
