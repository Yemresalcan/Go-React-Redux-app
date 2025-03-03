package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go-react-redux-app/config"
	"go-react-redux-app/controllers"
	"go-react-redux-app/middleware"
	"go-react-redux-app/models"
	"go-react-redux-app/routes"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize the database
	if err := cfg.InitDB(); err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}
	defer cfg.DB.Close()

	// Create the router
	router := mux.NewRouter()

	// Initialize stores
	userStore := models.NewUserStore(cfg.DB)
	projectStore := models.NewProjectStore(cfg.DB)
	taskStore := models.NewTaskStore(cfg.DB)

	// Create database tables
	if err := userStore.CreateTables(); err != nil {
		log.Fatalf("Error creating user tables: %v", err)
	}
	
	if err := projectStore.CreateTables(); err != nil {
		log.Fatalf("Error creating project tables: %v", err)
	}
	
	if err := taskStore.CreateTables(); err != nil {
		log.Fatalf("Error creating task tables: %v", err)
	}

	// Initialize auth middleware
	auth := middleware.NewAuth(cfg.JWTKey)

	// Initialize controllers
	authController := controllers.NewAuthController(userStore, auth)
	projectController := controllers.NewProjectController(projectStore)
	taskController := controllers.NewTaskController(taskStore, projectStore)

	// Setup routes
	routes.SetupRoutes(router, auth, authController, projectController, taskController)

	// CORS ayarlarını ekleyelim
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.ExposedHeaders([]string{"Content-Length"}),
		handlers.AllowCredentials(),
		handlers.MaxAge(86400), // 24 saat
	)

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), corsMiddleware(router)))
}
