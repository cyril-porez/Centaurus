package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

//AddWeight godoc
//@Summary A  dd a weight horse
//@Description Add a weight horse
//@Tags Weights
//@Accept json
//@Produce json
//@Param addWeight body model.WeightInput true "Weight, fk_horse_id"
//@Success 201 {object} model.WeightCreateResponse "Weight added"
//@Failure 400 {object} model.ErrorResponse "Bad request"
//@Failure 500 {object} model.ErrorResponse "Internal server error"
//@Router /api/v1/horses/{id}/weights [post]
func AddWeight(c *gin.Context, db *sql.DB, weightService *service.Weightservice) {
	horseIdStr := c.Param("id") 
	horseId, err := strconv.Atoi(horseIdStr)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid horse ID", model.ErrorResponseInput{
			Details: []model.ErrorDetail{{Field: "id", Issue: "Horse ID must be a valid integer"}},
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Get: model.Link{Method: "POST", Href: "/api/v1/horses/" + horseIdStr + "/weights"},
			},
		})
		return
	}

	var input model.WeightInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid request body", model.ErrorResponseInput{
			Details: []model.ErrorDetail{{Field: "body", Issue: "The provided weight data is not valid"}},
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Get: model.Link{Method: "POST", Href: "/api/v1/horses/" + horseIdStr + "/weights"},
			},
		})
		return
	}

	weight, details, err := weightService.AddWeightHorse(db, &input, horseId)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Internal Server Error", model.ErrorResponseInput{
			Meta:  map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{Get: model.Link{Method: "POST", Href: "/api/v1/horses/" + horseIdStr + "/weights"}},
		})
		return
	}
	if len(details) > 0 {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Validation Error", model.ErrorResponseInput{
			Details: details,
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links:   model.Links{Get: model.Link{Method: "POST", Href: "/api/v1/horses/" + horseIdStr + "/weights"}},
		})
		return
	}

	resp := model.WeightCreateResponse{
	Weight: model.WeightData{
		Weight:    weight.Weight,
		FkHorseId: weight.FkHorseId,
		CreatedAt: weight.CreatedAt,
	},
	Links: model.Links{
		Get: model.Link{
			Method: "GET",
			Href:   fmt.Sprintf("/api/v1/horses/%d/weights", weight.FkHorseId), 
		},
	},
	Meta: model.MetaSimple{
		Message: "Weight added successfully",
	},
}
	utils.WriteSuccesResponse(c, http.StatusCreated, resp)
}

// GetHorseWeights godoc
// @Summary Get horse weights
// @Description Retrieve weights of a horse. Use query parameters to filter: limit, sort (asc|desc), and compare=true to include last weight difference.
// @Tags Weights
// @Accept json
// @Produce json
// @Param id path int true "Horse ID"
// @Param limit query int false "Limit number of weights returned (e.g., 1, 6, etc.)"
// @Param sort query string false "Sort order (asc or desc). Default is asc."
// @Param compare query bool false "Include comparison fields for last weight (only works with limit=1)"
// @Success 200 {object} model.Weights "Horse weights data"
// @Failure 400 {object} map[string]string "Validation error"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /api/v1/horses/{id}/weights [get]
func GetHoreseWeights(c *gin.Context, db *sql.DB, weightService *service.Weightservice) {
	idParam := c.Param("id")
	limit := c.DefaultQuery("limit", "")
	sort := c.DefaultQuery("sort", "asc")
	compare := c.DefaultQuery("compare", "false")

	horseId, err := strconv.Atoi(idParam)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid horse ID", model.ErrorResponseInput{
			Details: []model.ErrorDetail{{Field: "id", Issue: "Must be an integer"}},
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Get: model.Link{Method: "GET", Href: "/api/v1/horses/" + idParam + "/weights"},
			},
		})
		return
	}

	horse, weights, comparison, details, err := weightService.GetHorseWeights(db, horseId, limit, sort, compare)
	if err != nil || len(details) > 0 {
		status := http.StatusInternalServerError
		if len(details) > 0 {
			status = http.StatusBadRequest
		}
		utils.WriteErrorResponse(c, status, "Failed to retrieve horse weights", model.ErrorResponseInput{
			Details: details,
			Meta:    map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: model.Links{
				Get: model.Link{Method: "GET", Href: "/api/v1/horses/" + idParam + "/weights"},
			},
		})
		return
	}

	var weightsData []model.WeightData
	for _, w := range weights {
		weightsData = append(weightsData, model.WeightData{
			Weight:    w.Weight,
			FkHorseId: w.FkHorseId,
			CreatedAt: w.CreatedAt,
		})
	}

	resp := model.HorseWeightsResponse{
		Horse: model.HorseWeight{
			Name: horse.Name,
			Data: weightsData,
		},
		Links: model.Links{
			Get: model.Link{Method: "GET", Href: "/api/v1/horses/" + idParam + "/weights"},
		},
		Meta: model.Meta{
			Count:   len(weights),
			Message: "Horse weights retrieved successfully",
		},
	}

	// Ajout de la comparaison si `compare=true` && `limit=1`
	if comparison != nil {
		resp.Horse.LastWeight = comparison.LastWeight
		resp.Horse.DifferenceWeight = comparison.DifferenceWeight
		resp.Horse.LastDate = comparison.LastDate
		resp.Horse.CreatedAt = comparison.CreatedAt
	}

	utils.WriteSuccesResponse(c, http.StatusOK, resp)
}