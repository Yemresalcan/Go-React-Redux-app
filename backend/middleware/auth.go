package middleware

import (
	"context"
	"errors"
	"fmt"
	"go-react-redux-app/models"
	"go-react-redux-app/utils"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Auth is a middleware for authentication
type Auth struct {
	JWTKey string
}

// NewAuth creates a new Auth middleware
func NewAuth(jwtKey string) *Auth {
	return &Auth{JWTKey: jwtKey}
}

// GenerateToken generates a new JWT token for the given user ID, username, and role
func (a *Auth) GenerateToken(userID string, username string, role string) (string, error) {
	// Create the claims
	expiration := time.Now().Add(time.Hour * 72) // Token expires in 72 hours
	
	claims := jwt.MapClaims{
		"id":       userID,
		"username": username,
		"role":     role,
		"exp":      expiration.Unix(),
	}

	fmt.Printf("Generating token for user: %s, role: %s, expires: %s\n", 
		username, role, expiration.Format(time.RFC3339))

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token
	tokenString, err := token.SignedString([]byte(a.JWTKey))
	if err != nil {
		fmt.Printf("Error signing token: %v\n", err)
		return "", err
	}

	fmt.Printf("Token generated successfully: %s...\n", tokenString[:10])
	return tokenString, nil
}

// Middleware is a middleware function that checks for a valid JWT token
func (a *Auth) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the Authorization header
		authHeader := r.Header.Get("Authorization")
		fmt.Printf("Auth Middleware - Authorization header: %s\n", authHeader)
		
		if authHeader == "" {
			fmt.Println("Auth Middleware - Missing Authorization header")
			utils.RespondWithError(w, http.StatusUnauthorized, "Authorization header is required")
			return
		}

		// Check if the Authorization header has the correct format
		if !strings.HasPrefix(authHeader, "Bearer ") {
			fmt.Println("Auth Middleware - Invalid Authorization header format")
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid Authorization header format")
			return
		}

		// Extract the token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		fmt.Printf("Auth Middleware - Token: %s...\n", tokenString[:10])

		// Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				fmt.Printf("Auth Middleware - Unexpected signing method: %v\n", token.Header["alg"])
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(a.JWTKey), nil
		})

		if err != nil {
			fmt.Printf("Auth Middleware - Token parse error: %v\n", err)
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token: "+err.Error())
			return
		}

		// Check if the token is valid
		if !token.Valid {
			fmt.Println("Auth Middleware - Invalid token")
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token")
			return
		}

		// Extract the claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			fmt.Println("Auth Middleware - Invalid token claims")
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token claims")
			return
		}

		// Debug claims
		fmt.Printf("Auth Middleware - Token claims: %+v\n", claims)

		// Extract the user ID and role
		userID, ok := claims["id"].(string)
		if !ok {
			fmt.Println("Auth Middleware - Missing user ID in token")
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token claims: missing user ID")
			return
		}

		username, ok := claims["username"].(string)
		if !ok {
			fmt.Println("Auth Middleware - Missing username in token")
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token claims: missing username")
			return
		}

		role, ok := claims["role"].(string)
		if !ok {
			fmt.Println("Auth Middleware - Missing role in token")
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid token claims: missing role")
			return
		}

		fmt.Printf("Auth Middleware - Valid token for user: %s, role: %s\n", username, role)

		// Create a user object
		user := &models.User{
			ID:       userID,
			Username: username,
			Role:     role,
		}

		// Create a new context with the user
		ctx := context.WithValue(r.Context(), "user", user)

		// Call the next handler with the new context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RoleMiddleware is a middleware function that checks if the user has the required role
func (a *Auth) RoleMiddleware(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get the user from the context
			user, err := GetUserFromContext(r.Context())
			if err != nil {
				utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
				return
			}

			// Check if the user has the required role
			if user.Role != role {
				utils.RespondWithError(w, http.StatusForbidden, "Forbidden: Required role: "+role)
				return
			}

			// Call the next handler
			next.ServeHTTP(w, r)
		})
	}
}

// GetUserFromContext gets the user from the context
func GetUserFromContext(ctx context.Context) (*models.User, error) {
	user, ok := ctx.Value("user").(*models.User)
	if !ok {
		return nil, errors.New("user not found in context")
	}
	return user, nil
}
