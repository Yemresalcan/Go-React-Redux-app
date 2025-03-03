package controllers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"go-react-redux-app/middleware"
	"go-react-redux-app/models"
	"go-react-redux-app/utils"
)

// AuthController handles authentication requests
type AuthController struct {
	UserStore *models.UserStore
	Auth      *middleware.Auth
}

// NewAuthController creates a new AuthController
func NewAuthController(userStore *models.UserStore, auth *middleware.Auth) *AuthController {
	return &AuthController{
		UserStore: userStore,
		Auth:      auth,
	}
}

// RegisterRequest represents a request to register a new user
type RegisterRequest struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// LoginRequest represents a request to login
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// AuthResponse represents a response to an authentication request
type AuthResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

// Register handles user registration
func (c *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate the request
	if req.Username == "" || req.Email == "" || req.Password == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Username, email, and password are required")
		return
	}

	// Check if the username is already taken
	_, err = c.UserStore.GetByUsername(req.Username)
	if err == nil {
		utils.RespondWithError(w, http.StatusConflict, "Username is already taken")
		return
	}

	// Create the user
	user := &models.User{
		ID:        uuid.New().String(),
		Username:  req.Username,
		Email:     req.Email,
		Password:  req.Password,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      "user",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err = c.UserStore.Create(user)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error creating user")
		return
	}

	// Generate a token
	token, err := c.Auth.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error generating token")
		return
	}

	// Remove the password from the user object
	user.Password = ""

	// Return the token and user
	utils.RespondWithSuccess(w, http.StatusCreated, "User registered successfully", AuthResponse{
		Token: token,
		User:  user,
	})
}

// Login handles user login
func (c *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate the request
	if req.Username == "" || req.Password == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Username and password are required")
		return
	}

	// Get the user
	user, err := c.UserStore.GetByUsername(req.Username)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	// Check the password
	if !user.CheckPassword(req.Password) {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	// Generate a token
	token, err := c.Auth.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error generating token")
		return
	}

	// Remove the password from the user object
	user.Password = ""

	// Return the token and user
	utils.RespondWithSuccess(w, http.StatusOK, "Login successful", AuthResponse{
		Token: token,
		User:  user,
	})
}

// VerifyToken handles token verification
func (c *AuthController) VerifyToken(w http.ResponseWriter, r *http.Request) {
	// The user is already authenticated by the middleware
	// Get the user from the context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token")
		return
	}

	// Get the full user from the database
	dbUser, err := c.UserStore.GetByID(user.ID)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "User not found")
		return
	}

	// Remove the password from the user object
	dbUser.Password = ""

	// Return the user
	utils.RespondWithSuccess(w, http.StatusOK, "Token is valid", map[string]interface{}{
		"user": dbUser,
	})
}
