package routes

import (
	"fmt"
	"github.com/gorilla/mux"
	"go-react-redux-app/controllers"
	"go-react-redux-app/middleware"
	"go-react-redux-app/utils"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// SetupRoutes sets up the routes for the API
func SetupRoutes(router *mux.Router, auth *middleware.Auth, authController *controllers.AuthController, projectController *controllers.ProjectController, taskController *controllers.TaskController) {
	// API router
	apiRouter := router.PathPrefix("/api").Subrouter()

	// Public routes
	publicRouter := apiRouter.PathPrefix("").Subrouter()
	publicRouter.HandleFunc("/auth/register", authController.Register).Methods("POST", "OPTIONS")
	publicRouter.HandleFunc("/auth/login", authController.Login).Methods("POST", "OPTIONS")
	
	// Token doğrulama endpoint'i
	publicRouter.HandleFunc("/auth/verify-token", func(w http.ResponseWriter, r *http.Request) {
		// Token doğrulama işlemi
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.RespondWithError(w, http.StatusUnauthorized, "Authorization header is required")
			return
		}

		// Check if the Authorization header has the correct format
		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			utils.RespondWithError(w, http.StatusUnauthorized, "Authorization header format must be Bearer {token}")
			return
		}

		// Get the token
		tokenString := headerParts[1]
		
		// Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(auth.JWTKey), nil
		})

		if err != nil {
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token: " + err.Error())
			return
		}

		if !token.Valid {
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token")
			return
		}

		// Token geçerli, başarılı yanıt döndür
		utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Token is valid",
		})
	}).Methods("GET", "OPTIONS")

	// Protected routes
	protectedRouter := apiRouter.PathPrefix("").Subrouter()
	protectedRouter.Use(auth.Middleware)

	// Project routes
	protectedRouter.HandleFunc("/projects", projectController.GetProjects).Methods("GET", "OPTIONS")
	protectedRouter.HandleFunc("/projects", projectController.CreateProject).Methods("POST", "OPTIONS")
	protectedRouter.HandleFunc("/projects/{id}", projectController.GetProject).Methods("GET", "OPTIONS")
	protectedRouter.HandleFunc("/projects/{id}", projectController.UpdateProject).Methods("PUT", "OPTIONS")
	protectedRouter.HandleFunc("/projects/{id}", projectController.DeleteProject).Methods("DELETE", "OPTIONS")

	// Task routes
	protectedRouter.HandleFunc("/tasks", taskController.GetAllTasks).Methods("GET", "OPTIONS")
	protectedRouter.HandleFunc("/projects/{projectId}/tasks", taskController.GetTasks).Methods("GET", "OPTIONS")
	protectedRouter.HandleFunc("/tasks", taskController.CreateTask).Methods("POST", "OPTIONS")
	protectedRouter.HandleFunc("/tasks/{id}", taskController.GetTask).Methods("GET", "OPTIONS")
	protectedRouter.HandleFunc("/tasks/{id}", taskController.UpdateTask).Methods("PUT", "OPTIONS")
	protectedRouter.HandleFunc("/tasks/{id}", taskController.DeleteTask).Methods("DELETE", "OPTIONS")

	// Admin routes
	adminRouter := apiRouter.PathPrefix("/admin").Subrouter()
	adminRouter.Use(auth.Middleware)
	adminRouter.Use(auth.RoleMiddleware("admin"))

	// Add admin routes here if needed
}
