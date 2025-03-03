package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Config holds all configuration for the server
type Config struct {
	DB     *sql.DB
	Port   int
	JWTKey string
}

// LoadConfig loads the configuration from environment variables
func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Database configuration
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "projectmanagement")
	sslMode := getEnv("DB_SSLMODE", "disable")

	// Server configuration
	port, err := strconv.Atoi(getEnv("PORT", "8080"))
	if err != nil {
		log.Fatal("Invalid PORT environment variable")
	}

	// JWT configuration
	jwtKey := getEnv("JWT_KEY", "your-secret-key")

	// Connect to database
	dbInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, sslMode)

	db, err := sql.Open("postgres", dbInfo)
	if err != nil {
		log.Println("Warning: Could not connect to database:", err)
		log.Println("Running in memory mode")
	} else {
		err = db.Ping()
		if err != nil {
			log.Println("Warning: Could not ping database:", err)
			log.Println("Running in memory mode")
			db = nil
		} else {
			log.Println("Connected to database")
		}
	}

	return &Config{
		DB:     db,
		Port:   port,
		JWTKey: jwtKey,
	}
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// Close closes the database connection
func (c *Config) Close() {
	if c.DB != nil {
		c.DB.Close()
	}
}

// InitDB initializes the database with the schema
func (c *Config) InitDB() error {
	if c.DB == nil {
		return fmt.Errorf("database connection is not established")
	}

	// Check if schema file exists
	schemaFile := "schema.sql"
	if _, err := os.Stat(schemaFile); os.IsNotExist(err) {
		return fmt.Errorf("schema file not found: %s", schemaFile)
	}

	// Read schema file
	schema, err := os.ReadFile(schemaFile)
	if err != nil {
		return fmt.Errorf("error reading schema file: %v", err)
	}

	// Execute schema
	_, err = c.DB.Exec(string(schema))
	if err != nil {
		return fmt.Errorf("error executing schema: %v", err)
	}

	log.Println("Database schema initialized successfully")
	return nil
}
