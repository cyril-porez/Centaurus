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
//@Summary add a weight horse
//@Description add a weight horse
//@Tags Weights
//@Accept json
//@Produce json
//@Param addhorse body model.Weights true "Weight, fk_horse_id"
//@Success 201 {object} model.Weights "Weight add"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/horse/:id [post]
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