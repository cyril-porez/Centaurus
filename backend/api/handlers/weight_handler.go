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
//@Router /api/v1/weight/:id [post]
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


//GetLastWeight godoc
//@Summary get last a weight horse 
//@Description get last weight horse and date
//@Tags Weights
//@Accept json
//@Produce json
//@Param id path int true "Horse Id"
//@Success 200 {object} model.Weights "Weight add"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/weight/:id [get]
func GetLastWeightHorse(c *gin.Context, db *sql.DB, id string) {
	var newWeight model.Weights ;
	var horse model.Horses;

	if details, err := service.GetLastWeightHorse(db, &newWeight, &horse,id); err != nil || len(details) > 0 {
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
			"name": horse.Name,
      "weight": newWeight.Weight,
			"last_weight" : newWeight.LastWeight,
			"difference_weight": newWeight.DifferenceWeight,
			"date": newWeight.Date,
			"previous_date": newWeight.LastDate,
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

	utils.WriteSuccesResponse(c, http.StatusOK, "get data successful", body)

}

//GetLastSixWeightsHorse godoc
//@Summary get last six weights horse 
//@Description get last six weights horse and date
//@Tags Weights
//@Accept json
//@Produce json
//@Param id path int true "Horse Id"
//@Success 200 {object} model.Weights "Weight add"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/last-weights/:id [get]
func GetLastSixWeightsHorse(c *gin.Context, db *sql.DB, id string) {
	name,weights ,details, err := service.GetLastSixWeightsHorse(db, id)
	if  err != nil || len(details) > 0 {
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
			"name": name.Name,
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

	utils.WriteSuccesResponse(c, http.StatusOK, "get data horses successful", body)
}

//GetxWeightsHorse godoc
//@Summary get weights horse 
//@Description get weights horse and date
//@Tags Weights
//@Accept json
//@Produce json
//@Param id path int true "Horse Id"
//@Success 200 {object} model.Weights "Weight add"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/weights/:id [get]
func GetWeightsHorse(c *gin.Context, db *sql.DB, id string) {
	name,weights ,details, err := service.GetWeightsHorse(db, id)
	if  err != nil || len(details) > 0 {
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
			"name": name.Name,
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

	utils.WriteSuccesResponse(c, http.StatusOK, "get data horses successful", body)
}