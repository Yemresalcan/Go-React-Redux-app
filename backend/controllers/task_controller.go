package controllers

import (
	"encoding/json"
	"go-react-redux-app/middleware"
	"go-react-redux-app/models"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"go-react-redux-app/utils"
)

// TaskController handles task-related requests
type TaskController struct {
	TaskStore    *models.TaskStore
	ProjectStore *models.ProjectStore
}

// NewTaskController creates a new TaskController
func NewTaskController(taskStore *models.TaskStore, projectStore *models.ProjectStore) *TaskController {
	return &TaskController{
		TaskStore:    taskStore,
		ProjectStore: projectStore,
	}
}

// GetAllTasks handles getting all tasks
func (c *TaskController) GetAllTasks(w http.ResponseWriter, r *http.Request) {
	// Get user from context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get all tasks
	tasks, err := c.TaskStore.GetAll()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// If user is not an admin, filter tasks to only include those from projects they have access to
	if user.Role != "admin" {
		// Get projects for user
		projects, err := c.ProjectStore.GetByUser(user.ID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Create a map of project IDs for quick lookup
		projectIDs := make(map[string]bool)
		for _, project := range projects {
			projectIDs[project.ID] = true
		}

		// Filter tasks
		filteredTasks := []*models.Task{}
		for _, task := range tasks {
			if projectIDs[task.ProjectID] {
				filteredTasks = append(filteredTasks, &task)
			}
		}

		utils.RespondWithSuccess(w, http.StatusOK, "Tasks retrieved successfully", filteredTasks)
		return
	}

	// If user is admin, return all tasks
	utils.RespondWithSuccess(w, http.StatusOK, "Tasks retrieved successfully", tasks)
}

// GetTasks handles getting all tasks for a project
func (c *TaskController) GetTasks(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	projectID := vars["projectId"]

	// Get user from context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Check if user has access to project
	if user.Role != "admin" {
		// Get projects for user
		projects, err := c.ProjectStore.GetByUser(user.ID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Check if user has access to project
		hasAccess := false
		for _, project := range projects {
			if project.ID == projectID {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
			return
		}
	}

	// Get tasks for project
	tasks, err := c.TaskStore.GetByProject(projectID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Tasks retrieved successfully", tasks)
}

// GetTask handles getting a task by ID
func (c *TaskController) GetTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID := vars["id"]

	// Get user from context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get task
	task, err := c.TaskStore.GetByID(taskID)
	if err != nil {
		if err.Error() == "task not found" {
			utils.RespondWithError(w, http.StatusNotFound, "Task not found")
			return
		}
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Check if user has access to project
	if user.Role != "admin" {
		// Get projects for user
		projects, err := c.ProjectStore.GetByUser(user.ID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Check if user has access to project
		hasAccess := false
		for _, project := range projects {
			if project.ID == task.ProjectID {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
			return
		}
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Task retrieved successfully", task)
}

// CreateTask handles creating a new task
func (c *TaskController) CreateTask(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var task models.Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get user from context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Check if user has access to project
	if user.Role != "admin" {
		// Get projects for user
		projects, err := c.ProjectStore.GetByUser(user.ID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Check if user has access to project
		hasAccess := false
		for _, project := range projects {
			if project.ID == task.ProjectID {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
			return
		}
	}

	// Set task ID and timestamps
	task.ID = uuid.New().String()
	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()

	// Create task
	err = c.TaskStore.Create(task)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusCreated, "Task created successfully", task)
}

// UpdateTask handles updating a task
func (c *TaskController) UpdateTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID := vars["id"]

	// Get user from context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get existing task
	existingTask, err := c.TaskStore.GetByID(taskID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Task not found")
		return
	}

	// Check if user has access to the project
	if user.Role != "admin" {
		// Get projects for user
		userProjects, err := c.ProjectStore.GetByUser(user.ID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Check if user has access to this project
		hasAccess := false
		for _, project := range userProjects {
			if project.ID == existingTask.ProjectID {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			utils.RespondWithError(w, http.StatusForbidden, "You don't have access to this task")
			return
		}
	}

	// Decode request body
	var updatedTask models.Task
	err = json.NewDecoder(r.Body).Decode(&updatedTask)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Validate task
	if updatedTask.Title == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Title is required")
		return
	}

	if updatedTask.Status == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Status is required")
		return
	}

	if updatedTask.Priority == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Priority is required")
		return
	}

	if updatedTask.ProjectID == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Project ID is required")
		return
	}

	// Check if project exists
	_, err = c.ProjectStore.GetByID(updatedTask.ProjectID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Project not found")
		return
	}

	// Set ID and timestamps
	updatedTask.ID = taskID
	updatedTask.CreatedAt = existingTask.CreatedAt
	updatedTask.UpdatedAt = time.Now()

	err = c.TaskStore.Update(&updatedTask)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Task updated successfully", updatedTask)
}

// DeleteTask handles deleting a task
func (c *TaskController) DeleteTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID := vars["id"]

	// Get user from context
	user, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get task
	task, err := c.TaskStore.GetByID(taskID)
	if err != nil {
		if err.Error() == "task not found" {
			utils.RespondWithError(w, http.StatusNotFound, "Task not found")
			return
		}
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Check if user has access to project
	if user.Role != "admin" {
		// Get projects for user
		projects, err := c.ProjectStore.GetByUser(user.ID)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Check if user has access to project
		hasAccess := false
		for _, project := range projects {
			if project.ID == task.ProjectID {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
			return
		}
	}

	// Delete task
	err = c.TaskStore.Delete(taskID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithSuccess(w, http.StatusOK, "Task deleted successfully", nil)
}
