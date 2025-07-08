package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

//AddWeight godoc
//@Summary A  dd a weight horse
//@Description Add a weight horse
//@Tags Weights
//@Accept json
//@Produce json
//@Param addhorse body model.Weights true "Weight, fk_horse_id"
//@Success 201 {object} model.Weights "Weight add"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/horses/{id}/weights [post]
func AddWeight(c *gin.Context, db *sql.DB, id string) {
	var newWeight model.Weights ;

	if err := c.ShouldBindJSON(&newWeight); err != nil {
		body := utils.ErrorResponseInput{
			Details : []utils.ErrorDetail{
				{
					Field: "body",
					Issue: "The provided data is not valid",
				},
			},
			Meta : map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links : gin.H{
				"self":   "/api/v1/weight/:id",
				"Method": "POST",
			},
		}
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid REquest", body)
		return;
	}

	if details, err := service.AddWeightHorse(db, &newWeight, id); err != nil || len(details) > 0 {
		if len(details) > 0 {
			utils.WriteErrorResponse(c, http.StatusBadRequest, "Validation Error", utils.ErrorResponseInput{
				Details: details,
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/Weight/:id",
						"METHOD": "POST",
					},
				},
			})
		} else {
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "internal Server Error", utils.ErrorResponseInput{
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/auth/signin",
						"METHOD": "POST",
					},
				},
			})
		} 
		return
	}	

	body := gin.H{
    "horse": gin.H{
      "weight": newWeight.FkHorseId,
			"fk_horse_id": newWeight.FkHorseId,
		},
		"_links": gin.H{
        "sign-in": gin.H{
					"href":"/api/v1/horses/update",
					"Method": "POST", 
				},
		},
		"meta": gin.H{
			"createdAt": newWeight.CreatedAt,
			"welcomeMessage": "You add a weight of a horse", 
		},
	}

	utils.WriteSuccesResponse(c, http.StatusCreated, "Registration new successful", body)

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
func GetHoreseWeights(c *gin.Context, db *sql.DB, id string, limit string, sort string, compare string) {
	var details []utils.ErrorDetail

	horse, weights, comparisonData, details, err := service.GetHorseWeights(db, id, limit, sort, compare)
	if err != nil || len(details) > 0 {
		if len(details) > 0 {
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "Validation Error", utils.ErrorResponseInput{	
				Details: details,
				Meta: map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			})
		} else {
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "internal Server Error", utils.ErrorResponseInput{
				Meta: map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			})
		}
		return
	}

	body := gin.H{
    "horse": gin.H{
			"name": horse.Name,
      "data": weights,
		},
		"_links": gin.H{
        "sign-in": gin.H{
					"href":"/api/v1/horses/update",
					"Method": "PUT", 
				},
		},
		"meta": gin.H{
			"count": len(weights),
			"welcomeMessage": "You get data a horses for a user", 
		},
	}
	
	if comparisonData != nil {
		body["horse"].(gin.H)["last_weight"] = comparisonData.LastWeight
		body["horse"].(gin.H)["difference_weight"] = comparisonData.DifferenceWeight
		body["horse"].(gin.H)["previous_date"] = comparisonData.LastDate
		body["horse"].(gin.H)["date"] = comparisonData.CreatedAt
	}

	utils.WriteSuccesResponse(c, http.StatusOK, "Get weights successful", body)
}