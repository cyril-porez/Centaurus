package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/shared"
	"back-end-go/utils"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

//AddHorseHandler godoc
//@Summary add a horse test
//@Description add a h  test
//@Tags Horses
//@Accept json
//@Produce json
//@Param addhorse body model.HorseInput true "Horse data"
//@Success 201 {object} model.HorsesResponse "Horse created"
//@Failure 400 {object} model.ErrorResponse "Invalid input"
//@Failure 401 {object} model.ErrorResponse "Horse already exists"
//@Failure 409 {object} model.ErrorResponse "Horse already exists"
//@Failure 500 {object} model.ErrorResponse "Server error"
//@Router /api/v1/horses [post]
func AddHorseHandler(c *gin.Context, db *sql.DB, horseService *service.HorseService) {
	var input model.HorseInput

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid REquest", model.ErrorResponseInput{
			Details : []model.ErrorDetail{
				{
					Field: "body",
					Issue: "The provided data is not valid",
				},
			},
			Meta : map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links : gin.H{
				"self":   "/api/v1/horses/update",
				"Method": "POST",
			},
		})
		return
	}

	userID, ok := utils.GetUserIDFromContext(c)
	if !ok {
		return 
	}
	input.FkUserId = userID

	horse, details, err := horseService.CreateHorse(db, &input);
	if  err != nil || len(details) > 0 {
		code := http.StatusInternalServerError
		message := "Internal Server Error"
		
		if len(details) > 0 {
			code = http.StatusBadRequest
			message = "Validation Error"
		} 
		utils.WriteErrorResponse(c, code, message, model.ErrorResponseInput{
			Details: details,
			Meta: map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links: gin.H{
				"self": "/api/v1/horses",
				"method": "POST",
			},
		})	
		return
	}	

	resp := model.HorseCreateResponse{
		Horse: *horse,
		Links: model.Links{
        Update: &model.Link{
					Href:"/api/v1/horses/" + strconv.Itoa(horse.Id),
					Method: "PUT", 
				},
				Self: &model.Link{
					Href:"/api/v1/horses/" + strconv.Itoa(horse.Id),
					Method: "GET", 
				},
		},
		Meta: model.MetaSimple{
			Message: "You add a new horse", 
		},
	}

	utils.WriteSuccesResponse(c, http.StatusCreated, resp)
}

//UpdateHorseHandler godoc 
//@Summary Update a horse
//@Description Update a horse by ID
//@Tags Horses
//@Accept json
//@Produce json
//@Param id path int true "Horse ID"
//@Param addhorse body model.HorseUpdateInput true "Name, Age and Race"
//@Success 200 {object} model.HorseUpdateResponse "Horse updated"
//@Failure 400 {object} model.ErrorResponse "Invalid input"
//@Failure 401 {object} model.ErrorResponse "Unauthorized"
//@Failure 403 {object} model.ErrorResponse "Forbidden"
//@Failure 404 {object} model.ErrorResponse "Horse not found"
//@Failure 500 {object} model.ErrorResponse "Internal Error"
//@Router /api/v1/horses/{id} [put]
func UpdateHorseHandler(c *gin.Context, db *sql.DB, horseService *service.HorseService) {
	var input model.HorseUpdateInput

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid input", model.ErrorResponseInput{
			Details: []model.ErrorDetail{
				{Field: "body", Issue: "Malformed JSON or missing required fields"},
			},
			Meta:  map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{Self: &model.Link{Method: "GET", Href: "/api/v1/horses"}},
		})
		return
	}

	horseId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid ID", model.ErrorResponseInput{
			Details : []model.ErrorDetail{
				{
					Field: "id",
					Issue: "Horse ID must be an integer",
				},
			},
			Meta : map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links : gin.H{
				"self":   "/api/v1/horses/update",
				"Method": "POST",
			},
		})
		return			
	}

	userID, ok := utils.GetUserIDFromContext(c)
	if !ok {
		return 
	}
	

	horse, details, err := horseService.UpdateHorse(db, &input, horseId, userID);
	code := http.StatusInternalServerError
	message := "Internal Server Error"

	for _, d := range details {
		if d.Field == "authorization" {
			code = http.StatusForbidden
			message = "Forbidden"
			break
		}
	}
	if len(details) > 0 && code != http.StatusForbidden {
		code = http.StatusBadRequest
		message = "Validation Error"
	}
	if err != nil || len(details) > 0 {		
		utils.WriteErrorResponse(c, code, message, model.ErrorResponseInput{
			Details: details,
			Meta: map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links : gin.H{
				"sign-in": gin.H{
					"self":   "/api/v1/horses/update",
					"METHOD": "PUT",
				},
			},
		})	 
	return
	}

	resp := model.HorseCreateResponse{
		Horse: *horse,
		Links: model.Links{
			Update: &model.Link{Method: "PUT", Href: fmt.Sprintf("/api/v1/horses/%d", horse.Id)},
			Self:    &model.Link{Method: "GET", Href: fmt.Sprintf("/api/v1/horses/%d", horse.Id)},
		},
		Meta: model.MetaSimple{Message: "Horse updated successfully"},
	}
	

	utils.WriteSuccesResponse(c, http.StatusOK, resp)	
}

//GetHorseHandler godoc
//@Summary Get a horse
//@Description Retrieve a horse for a specific user
//@Tags Horses
//@Accept json
//@Produce json
//@Param id path int true "Horse Id"
//@Success 200 {object} model.HorseCreateResponse "Horse retrieved"
//@Failure 400 {object} model.ErrorResponse "Invalid ID format or validation error"
//@Failure 404 {object} model.ErrorResponse "Horse not found"
//@Failure 500 {object} model.ErrorResponse "Internal Server Error"
//@Router /api/v1/horses/{id} [get]
func GetHorseHandler(c *gin.Context, db *sql.DB, horseService *service.HorseService) {
	horseId, err := strconv.Atoi(c.Param("id")) 
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid horse ID", model.ErrorResponseInput{
			Details: []model.ErrorDetail{{Field: "id", Issue: "Must be an integer"}},
			Meta: map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Self:    &model.Link{Method: "GET", Href: fmt.Sprintf("/api/v1/horses/%d", horseId)},
			},
		})
		return
	}
	
	horse, details, err := horseService.GetHorse(db, horseId)
	if err != nil || len(details) > 0 {
		code := http.StatusInternalServerError
		message := "Internal Server Error"
		if len(details) > 0 {
			code = http.StatusNotFound
			message = "Horse not found"
		}
		utils.WriteErrorResponse(c, code, message, model.ErrorResponseInput{
			Details: details,
			Meta: map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links: model.Links{
				Self:    &model.Link{Method: "GET", Href: fmt.Sprintf("/api/v1/horses/%d", horseId)},
			},
		})
		return
	}

	resp := model.HorseCreateResponse{
		Horse: *horse,
		Links: model.Links{
			Update: &model.Link{Method: "PUT", Href: "/api/v1/horses/" + strconv.Itoa(horse.Id)},
			Self:   &model.Link{Method: "GET", Href: fmt.Sprintf("/api/v1/horses/" + strconv.Itoa(horse.Id))},
		},
		Meta: model.MetaSimple{Message: "Horse retrieved successfully"},
	}

	utils.WriteSuccesResponse(c, http.StatusOK, resp)
}

// GetHorsesByUserHanndler godoc
//@Summary Get horses by user ID 
//@Description Retrieve a list of horses for a specific user
//@Tags Horses
//@Accept json
//@Produce json
//@Param id path int true "User ID"
//@Success 200 {object} model.HorsesResponse "List of horses for the given user"
//@Failure 400 {object} model.ErrorResponse "Invalid user ID format or validation issue"
//@Failure 401 {object} model.ErrorResponse "User not found (if needed)"
//@Failure 500 {object} model.ErrorResponse "Internal server error"
//@Router /api/v1/users/{id}/horses [get]
func GetHorsesByUserHanndler(c *gin.Context, db *sql.DB, horseService *service.HorseService) {
	userIdStr := c.Param("id")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid user ID", model.ErrorResponseInput{
			Details: []model.ErrorDetail{{Field: "id", Issue: "User ID must be an integer"}},
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Self: &model.Link{Method:"GET", Href: fmt.Sprintf("/api/v1/users/%d/horses", userIdStr)},
			},
		})
		return
	}
	
	horses, details, err := horseService.GetHorsesByUserId(db, userId)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Internal Server Error", model.ErrorResponseInput{
			Details: nil,
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Self: &model.Link{Method: "GET", Href: fmt.Sprintf("/api/v1/users/%d/horses", userIdStr)},
			},
		})
		return
	}
	if len(details) > 0 {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Validation Error", model.ErrorResponseInput{
			Details: details,
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Self: &model.Link{Method: "GET", Href: fmt.Sprintf("/api/v1/users/%d/horses", userIdStr)},
			},
		})
		return
	}

	base := "/api/v1"
	items := make([]model.Horses, 0, len(horses))
	for _, h := range horses {
		createdAt := h.CreatedAt // assume time.Time depuis repo (idéalement UTC)
		items = append(items, model.Horses{
			Id:        h.Id,
			Name:      h.Name,
			Age:       h.Age,
			Race:      h.Race,
			FkUserId:  h.FkUserId,
			CreatedAt: createdAt,
			Links: model.Links{
				Self:    &model.Link{Method: "GET", Href: fmt.Sprintf("%s/horses/%d", base, h.Id)},
				Update:  &model.Link{Method: "PUT", Href: fmt.Sprintf("%s/horses/%d", base, h.Id)},
				Delete:  &model.Link{Method: "DELETE", Href: fmt.Sprintf("%s/horses/%d", base, h.Id)},
				Weights: &model.Link{Method:"GET", Href: fmt.Sprintf("%s/horses/%d/weights", base, h.Id)},
			},
		})
	}


	resp := model.HorseListResponse{
		Data:  items,
		Links: model.Links{
			Create: &model.Link{Method: "POST", Href: fmt.Sprintf("%s/horses", base)},
			Self:   &model.Link{Method: "GET", Href: "/api/v1/users/" + userIdStr + "/horses"},
		},
		Meta: model.Meta{
			Count:   len(horses),
			Message: "List of horses for the user",
		},
	}

	utils.WriteSuccesResponse(c, http.StatusOK, resp)
}

// DeleteHorseHanndler godoc
//@Summary delete a horse 
//@Description Delete horse
//@Tags Horses
//@Accept json
//@Produce json
//@Param id path int true "Horse ID"
//@Success 200 {object} map[string]interface{} "Horse deleted successfully"
//@Failure 400 {object} model.ErrorResponse "Invalid horse ID format"
//@Failure 404 {object} model.ErrorResponse "Horse not found"
//@Failure 500 {object} model.ErrorResponse "Internal server error"
//@Router /api/v1/horses/{id} [delete]
func DeleteHorseHandler(c *gin.Context, db *sql.DB, horseService *service.HorseService) {
	idParam := c.Param("id")
	horseId, err := strconv.Atoi(idParam)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid horse ID", model.ErrorResponseInput{
			Details: []model.ErrorDetail{{Field: "id", Issue: "Horse ID must be an integer"}},
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Self: &model.Link{
					Method: "DELETE",
					Href:   "/api/v1/horses/" + idParam,
				},
			},
		})
		return
	}
	
	err = horseService.DeleteHorse(db, horseId)
	if err != nil {
		switch err {
		case shared.ErrNotFound:
			utils.WriteErrorResponse(c, http.StatusNotFound, "Horse not found", model.ErrorResponseInput{
				Details: []model.ErrorDetail{{Field: "id", Issue: "No horse found with the given ID"}},
				Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
				Links:   model.Links{Self: &model.Link{Method: "DELETE", Href: "/api/v1/horses/" + idParam}},
			})
		default:
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "Internal Server Error", model.ErrorResponseInput{
				Meta:  map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
				Links: model.Links{Self: &model.Link{Method: "DELETE", Href: "/api/v1/horses/" + idParam}},
			})
		}
		return
	}
	
	

	resp := gin.H{
		"message": "Horse deleted successfully",
		"_links": gin.H{
			"create": gin.H{
				"method": "POST",
				"href": "/api/v1/horses",
			},
		},
		"meta": gin.H{
			"deletedAt":      time.Now().Format(time.RFC3339),
			"welcomeMessage": "The horse has been successfully removed",
		},
	}

	utils.WriteSuccesResponse(c, http.StatusOK, resp)
}