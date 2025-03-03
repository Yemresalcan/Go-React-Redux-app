package controllers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"go-react-redux-app/models"
	"go-react-redux-app/middleware"
	"go-react-redux-app/utils"
)

// ProjectController handles project requests
type ProjectController struct {
	ProjectStore *models.ProjectStore
}

// NewProjectController creates a new ProjectController
func NewProjectController(projectStore *models.ProjectStore) *ProjectController {
	return &ProjectController{
		ProjectStore: projectStore,
	}
}

// ProjectRequest represents a request to create or update a project
type ProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

// CreateProject handles project creation
func (c *ProjectController) CreateProject(w http.ResponseWriter, r *http.Request) {
	var req ProjectRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate the request
	if req.Name == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Project name is required")
		return
	}

	// Get the user from the context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Create the project
	project := &models.Project{
		ID:          uuid.New().String(),
		Name:        req.Name,
		Description: req.Description,
		Status:      req.Status,
		OwnerID:     user.ID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	err = c.ProjectStore.Create(project)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error creating project")
		return
	}

	utils.RespondWithSuccess(w, http.StatusCreated, "Project created successfully", project)
}

// GetProjects handles getting all projects for a user
func (c *ProjectController) GetProjects(w http.ResponseWriter, r *http.Request) {
	// Get the user from the context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get the projects
	projects, err := c.ProjectStore.GetByUser(user.ID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error getting projects")
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Projects retrieved successfully", projects)
}

// GetProject handles getting a project by ID
func (c *ProjectController) GetProject(w http.ResponseWriter, r *http.Request) {
	// Get the project ID from the URL
	vars := mux.Vars(r)
	projectID := vars["id"]

	// Get the user from the context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get the project
	project, err := c.ProjectStore.GetByID(projectID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Project not found")
		return
	}

	// Check if the user owns the project
	if project.OwnerID != user.ID {
		// Check if the user has admin role
		userRole, ok := r.Context().Value("userRole").(string)
		if !ok || userRole != "admin" {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
			return
		}
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Project retrieved successfully", project)
}

// UpdateProject handles updating a project
func (c *ProjectController) UpdateProject(w http.ResponseWriter, r *http.Request) {
	// Get the project ID from the URL
	vars := mux.Vars(r)
	projectID := vars["id"]

	var req ProjectRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate the request
	if req.Name == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Project name is required")
		return
	}

	// Get the user from the context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get the project
	project, err := c.ProjectStore.GetByID(projectID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Project not found")
		return
	}

	// Check if the user owns the project
	if project.OwnerID != user.ID {
		// Check if the user has admin role
		userRole, ok := r.Context().Value("userRole").(string)
		if !ok || userRole != "admin" {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
			return
		}
	}

	// Update the project
	project.Name = req.Name
	project.Description = req.Description
	project.Status = req.Status
	project.UpdatedAt = time.Now()

	err = c.ProjectStore.Update(project)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error updating project")
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Project updated successfully", project)
}

// DeleteProject handles deleting a project
func (c *ProjectController) DeleteProject(w http.ResponseWriter, r *http.Request) {
	// Get the project ID from the URL
	vars := mux.Vars(r)
	projectID := vars["id"]

	// Get the user from the context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get the project
	project, err := c.ProjectStore.GetByID(projectID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Project not found")
		return
	}

	// Check if the user owns the project
	if project.OwnerID != user.ID {
		// Check if the user has admin role
		userRole, ok := r.Context().Value("userRole").(string)
		if !ok || userRole != "admin" {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
			return
		}
	}

	// Delete the project
	err = c.ProjectStore.Delete(projectID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error deleting project")
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Project deleted successfully", nil)
}
